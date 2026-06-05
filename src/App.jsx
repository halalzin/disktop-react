import React from "react";
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { useGameState, computeClickValue, computeAutoValue, xpNeeded } from "./hooks/useGameState.js";
import { useAudio } from "./hooks/useAudio.js";
import { useToast } from "./hooks/useToast.js";
import { SONGS } from "./data/songs.js";
import { SKINS } from "./data/skins.js";
import { BUFFS } from "./data/buffs.js";
import { fmt } from "./utils/fmt.js";
import ToastContainer from "./components/ToastContainer.jsx";
import Header from "./components/Header.jsx";
import PrestigeBar from "./components/PrestigeBar.jsx";
import Vinyl from "./components/Vinyl.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import UpgradePanel from "./components/UpgradePanel.jsx";
import BuffPanel from "./components/BuffPanel.jsx";
import SkinPanel from "./components/SkinPanel.jsx";
import PrestigeModal from "./components/PrestigeModal.jsx";
function App() {
  const { toasts, toast } = useToast();
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const audio = useAudio();
  const handleLevelUp = useCallback((lvl) => {
    toast(`\u{1F3B5} N\xEDvel ${lvl} desbloqueado!`);
    if (lvl === 10) {
      setTimeout(() => toast("\u2726 N\xEDvel m\xE1ximo! Voc\xEA pode fazer PREST\xCDGIO agora.", "default", 5e3), 300);
    }
  }, [toast, audio]);
  const handleBuffExpire = useCallback((b) => {
    toast(`${b.emoji} ${b.name} expirou`);
  }, [toast]);
  const { state, click, buyUpgrade, activateBuff, equipSkin, unlockSkin, doPrestige, setTheme } = useGameState({ onLevelUp: handleLevelUp, onBuffExpire: handleBuffExpire });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);
  useEffect(() => {
    audio.loadAndPlay(state.currentSkin ? SKINS.find((s) => s.id === state.currentSkin)?.skinSong ?? 0 : 0);
  }, []);
  const clickValue = computeClickValue(state);
  const autoValue = computeAutoValue(state);
  const needed = xpNeeded(state.level, state.prestige);
  const xpPct = Math.min(100, state.xp / needed * 100).toFixed(1);
  const currentSong = SONGS[audio.songIndex];
  const vinylSpeed = currentSong?.speed ?? "medium";
  function handleEquipSkin(id) {
    equipSkin(id);
  }
  function handleUnlockSkin(id) {
    unlockSkin(id);
  }
  function handlePrestige() {
    doPrestige();
    setShowPrestigeModal(false);
    toast(`\u2726 Prest\xEDgio ${state.prestige + 1}! B\xF4nus: +${Math.round((state.prestige + 1) * 0.25 * 100)}%`, "default", 5e3);
  }
  const activeBuffChips = BUFFS.filter((b) => (state.buffTimers[b.id] || 0) > 0);
  return  React.createElement("div", { className: "app-root" },  React.createElement(ToastContainer, { toasts }), showPrestigeModal &&  React.createElement(
    PrestigeModal,
    {
      prestige: state.prestige,
      onConfirm: handlePrestige,
      onCancel: () => setShowPrestigeModal(false)
    }
  ),  React.createElement(
    Header,
    {
      song: currentSong,
      theme: state.theme,
      onToggleTheme: () => setTheme(state.theme === "light" ? "dark" : "light")
    }
  ),  React.createElement(PrestigeBar, { prestige: state.prestige, prestigeBonus: state.prestigeBonus }),  React.createElement("div", { className: "main-layout" },  React.createElement("aside", { className: "panel-left", "aria-label": "Upgrades e Buffs" },  React.createElement("div", { className: "stat-block" },  React.createElement("div", { className: "stat-label" }, "Spins Dispon\xEDveis"),  React.createElement("div", { className: "stat-value" }, fmt(state.spins)),  React.createElement("div", { className: "stat-sub" }, autoValue, " spins/seg")),  React.createElement("div", { className: "section-title" }, "Upgrades"),  React.createElement(
    UpgradePanel,
    {
      upgrades: state.upgrades,
      spins: state.spins,
      onBuy: buyUpgrade,
      onToast: toast
    }
  ),  React.createElement("br", null),  React.createElement("div", { className: "section-title" }, "Buffs"),  React.createElement(
    BuffPanel,
    {
      buffTimers: state.buffTimers,
      level: state.level,
      spins: state.spins,
      onActivate: activateBuff,
      onToast: toast
    }
  )),  React.createElement("main", { className: "panel-center", "aria-label": "Disco de Vinil" },  React.createElement("div", { className: "level-display" },  React.createElement("span", null, "LVL"),  React.createElement("span", { className: "level-num" }, state.level),  React.createElement("span", null, "/ 10")),  React.createElement("div", { className: "progress-wrap" },  React.createElement("div", { className: "progress-label" },  React.createElement("span", null, "XP: ", fmt(state.xp), " / ", fmt(needed)),  React.createElement("span", null, xpPct, "%")),  React.createElement("div", { className: "progress-bar-bg" },  React.createElement("div", { className: "progress-bar-fill", style: { width: `${xpPct}%` } }))),  React.createElement(
    Vinyl,
    {
      currentSkinId: state.currentSkin,
      speed: vinylSpeed,
      clickValue,
      onVinylClick: click
    }
  ),  React.createElement("div", { className: "active-buffs-row", "aria-live": "polite" }, activeBuffChips.map((b) =>  React.createElement("span", { key: b.id, className: "active-buff-chip" }, b.emoji, " ", b.name, " ", Math.ceil(state.buffTimers[b.id]), "s"))),  React.createElement("div", { className: "click-value-label" }, "+",  React.createElement("span", null, fmt(clickValue)), " spin / clique"),  React.createElement(
    MusicPlayer,
    {
      song: currentSong,
      isPlaying: audio.isPlaying,
      volume: audio.volume,
      fileError: audio.fileError,
      onTogglePlay: audio.togglePlay,
      onPrev: audio.prevTrack,
      onNext: audio.nextTrack,
      onVolumeChange: audio.setVolume
    }
  )),  React.createElement("aside", { className: "panel-right", "aria-label": "Skins e Prest\xEDgio" },  React.createElement("div", { className: "stat-block" },  React.createElement("div", { className: "stat-label" }, "Spins Totais (Vida)"),  React.createElement("div", { className: "stat-value" }, fmt(state.lifetime)),  React.createElement("div", { className: "stat-sub" }, "Prest\xEDgio: ", state.prestige, "\xD7 \u2605")),  React.createElement("div", { className: "section-title" }, "Skins"),  React.createElement(
    SkinPanel,
    {
      currentSkin: state.currentSkin,
      unlockedSkins: state.unlockedSkins,
      prestige: state.prestige,
      spins: state.spins,
      onEquip: handleEquipSkin,
      onUnlock: handleUnlockSkin,
      onToast: toast
    }
  ),  React.createElement("br", null),  React.createElement(
    "button",
    {
      className: "prestige-btn",
      onClick: () => setShowPrestigeModal(true),
      disabled: state.level < 10
    },
    "\u2726 PREST\xCDGIO (nv. 10)"
  ),  React.createElement("div", { className: "prestige-hint" }, state.level >= 10 ? "\u2726 Pronto para prestigiar!" : `Alcance o n\xEDvel 10 para prestigiar (nv. ${state.level}/10)`))));
}
export {
  App as default
};
