import { useReducer, useEffect, useRef, useCallback } from "react";
import { UPGRADES } from "../data/upgrades.js";
import { BUFFS } from "../data/buffs.js";
import { SKINS } from "../data/skins.js";
const SAVE_KEY = "disktop_save_v3";
const MAX_LVL = 10;
function xpNeeded(level, prestige = 0) {
  return Math.floor(100 * Math.pow(10, prestige) * Math.pow(1.6, level - 1));
}
function defaultState() {
  const upgrades = {};
  const buffTimers = {};
  const unlockedSkins = ["classic"];
  UPGRADES.forEach((u) => {
    upgrades[u.id] = 0;
  });
  BUFFS.forEach((b) => {
    buffTimers[b.id] = 0;
  });
  return {
    spins: 0,
    lifetime: 0,
    level: 1,
    xp: 0,
    prestige: 0,
    prestigeBonus: 1,
    currentSkin: "classic",
    theme: "light",
    upgrades,
    buffTimers,
    unlockedSkins
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const base = defaultState();
    const state = {
      ...base,
      ...saved,
      upgrades: { ...base.upgrades, ...saved.upgrades ?? {} },
      buffTimers: { ...base.buffTimers, ...saved.buffTimers ?? {} },
      unlockedSkins: saved.unlockedSkins ?? ["classic"]
    };
    return state;
  } catch {
    return defaultState();
  }
}
function computeClickValue(state) {
  let base = 1 + (state.prestige || 0);
  UPGRADES.forEach((u) => {
    if (u.effect === "click") base += u.val * (state.upgrades[u.id] || 0);
  });
  let mult = state.prestigeBonus;
  UPGRADES.forEach((u) => {
    if (u.effect === "mult_click" && (state.upgrades[u.id] || 0) > 0) mult *= u.val;
  });
  BUFFS.forEach((b) => {
    if ((state.buffTimers[b.id] || 0) > 0 && (b.effect === "click_mult" || b.effect === "all_mult"))
      mult *= b.val;
  });
  return Math.max(1, Math.floor(base * mult));
}
function computeAutoValue(state) {
  let base = 0;
  UPGRADES.forEach((u) => {
    if (u.effect === "auto") base += u.val * (state.upgrades[u.id] || 0);
  });
  let mult = state.prestigeBonus;
  UPGRADES.forEach((u) => {
    if (u.effect === "mult_auto" && (state.upgrades[u.id] || 0) > 0) mult *= u.val;
  });
  BUFFS.forEach((b) => {
    if ((state.buffTimers[b.id] || 0) > 0 && (b.effect === "auto_mult" || b.effect === "all_mult"))
      mult *= b.val;
  });
  return Math.round(base * mult * 10) / 10;
}
function upgradeCost(upgradeId, owned) {
  const u = UPGRADES.find((x) => x.id === upgradeId);
  return Math.floor(u.cost * Math.pow(1.5, owned));
}
function applyXp(draft, amount) {
  if (draft.level >= MAX_LVL) return [];
  draft.xp += amount;
  const events = [];
  while (draft.level < MAX_LVL && draft.xp >= xpNeeded(draft.level, draft.prestige)) {
    draft.xp -= xpNeeded(draft.level, draft.prestige);
    draft.level++;
    events.push({ type: "levelUp", level: draft.level });
  }
  return events;
}
function reducer(state, action) {
  switch (action.type) {
    case "TICK": {
      const { delta, onLevelUp, onBuffExpire } = action;
      const s = { ...state, upgrades: { ...state.upgrades }, buffTimers: { ...state.buffTimers } };
      const auto = computeAutoValue(s);
      const gain = auto * delta;
      s.spins += gain;
      s.lifetime += gain;
      const events = applyXp(s, gain);
      events.forEach((e) => onLevelUp && onLevelUp(e.level));
      BUFFS.forEach((b) => {
        if ((s.buffTimers[b.id] || 0) > 0) {
          s.buffTimers[b.id] = Math.max(0, s.buffTimers[b.id] - delta);
          if (s.buffTimers[b.id] === 0) onBuffExpire && onBuffExpire(b);
        }
      });
      return s;
    }
    case "CLICK": {
      const { clickVal, onLevelUp } = action;
      const s = { ...state };
      s.spins = state.spins + clickVal;
      s.lifetime = state.lifetime + clickVal;
      const draft = { ...s };
      const events = applyXp(draft, clickVal);
      events.forEach((e) => onLevelUp && onLevelUp(e.level));
      return { ...s, level: draft.level, xp: draft.xp };
    }
    case "BUY_UPGRADE": {
      const { id } = action;
      const owned = state.upgrades[id] || 0;
      const cost = upgradeCost(id, owned);
      if (state.spins < cost) return state;
      return {
        ...state,
        spins: state.spins - cost,
        upgrades: { ...state.upgrades, [id]: owned + 1 }
      };
    }
    case "ACTIVATE_BUFF": {
      const b = BUFFS.find((x) => x.id === action.id);
      if (!b || state.spins < b.cost || (state.buffTimers[b.id] || 0) > 0) return state;
      return {
        ...state,
        spins: state.spins - b.cost,
        buffTimers: { ...state.buffTimers, [b.id]: b.duration }
      };
    }
    case "EQUIP_SKIN":
      return { ...state, currentSkin: action.id };
    case "UNLOCK_SKIN": {
      const skin = SKINS.find((s) => s.id === action.id);
      if (!skin || state.spins < skin.cost) return state;
      return {
        ...state,
        spins: state.spins - skin.cost,
        currentSkin: action.id,
        unlockedSkins: [... new Set([...state.unlockedSkins, action.id])]
      };
    }
    case "PRESTIGE": {
      const newPrestige = state.prestige + 1;
      const upgrades = {};
      const buffTimers = {};
      UPGRADES.forEach((u) => {
        upgrades[u.id] = 0;
      });
      BUFFS.forEach((b) => {
        buffTimers[b.id] = 0;
      });
      const unlockedSkins = [...state.unlockedSkins];
      SKINS.forEach((s) => {
        if (s.prestige && newPrestige >= s.prestige && !unlockedSkins.includes(s.id)) unlockedSkins.push(s.id);
      });
      return {
        ...state,
        spins: 0,
        level: 1,
        xp: 0,
        prestige: newPrestige,
        prestigeBonus: 1 + newPrestige * 0.25,
        upgrades,
        buffTimers,
        unlockedSkins
      };
    }
    case "SET_THEME":
      return { ...state, theme: action.theme };
    case "LOAD":
      return action.state;
    default:
      return state;
  }
}
function useGameState({ onLevelUp, onBuffExpire }) {
  const [state, dispatch] = useReducer(reducer, void 0, loadState);
  const cbRefs = useRef({ onLevelUp, onBuffExpire });
  cbRefs.current = { onLevelUp, onBuffExpire };
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, 1e4);
    return () => clearInterval(id);
  }, [state]);
  useEffect(() => {
    return () => localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({
        type: "TICK",
        delta: 0.1,
        onLevelUp: (lvl) => cbRefs.current.onLevelUp?.(lvl),
        onBuffExpire: (b) => cbRefs.current.onBuffExpire?.(b)
      });
    }, 100);
    return () => clearInterval(id);
  }, []);
  const click = useCallback(() => {
    dispatch({
      type: "CLICK",
      clickVal: computeClickValue(state),
      onLevelUp: (lvl) => cbRefs.current.onLevelUp?.(lvl)
    });
  }, [state]);
  const buyUpgrade = useCallback((id) => dispatch({ type: "BUY_UPGRADE", id }), []);
  const activateBuff = useCallback((id) => dispatch({ type: "ACTIVATE_BUFF", id }), []);
  const equipSkin = useCallback((id) => dispatch({ type: "EQUIP_SKIN", id }), []);
  const unlockSkin = useCallback((id) => dispatch({ type: "UNLOCK_SKIN", id }), []);
  const doPrestige = useCallback(() => dispatch({ type: "PRESTIGE" }), []);
  const setTheme = useCallback((theme) => dispatch({ type: "SET_THEME", theme }), []);
  return { state, click, buyUpgrade, activateBuff, equipSkin, unlockSkin, doPrestige, setTheme };
}
export {
  computeAutoValue,
  computeClickValue,
  upgradeCost,
  useGameState,
  xpNeeded
};
