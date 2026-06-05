import React from "react";
import { BUFFS } from "../data/buffs.js";
import { fmt } from "../utils/fmt.js";
function BuffPanel({ buffTimers, level, spins, onActivate, onToast }) {
  function handleActivate(b) {
    if (level < b.unlockLevel) {
      onToast(`\u{1F512} Requer n\xEDvel ${b.unlockLevel}!`, "error");
      return;
    }
    if ((buffTimers[b.id] || 0) > 0) {
      onToast("\u26A1 Buff j\xE1 est\xE1 ativo!", "error");
      return;
    }
    if (spins < b.cost) {
      onToast("\u274C Spins insuficientes!", "error");
      return;
    }
    onActivate(b.id);
    onToast(`${b.emoji} ${b.name} ativado por ${b.duration}s!`);
  }
  return  React.createElement("div", { className: "buff-list" }, BUFFS.map((b) => {
    const remaining = buffTimers[b.id] || 0;
    const isActive = remaining > 0;
    const locked = level < b.unlockLevel;
    const pct = isActive ? (remaining / b.duration * 100).toFixed(1) : 0;
    return  React.createElement(
      "div",
      {
        key: b.id,
        className: `buff-card${isActive ? " active" : ""}${locked ? " locked" : ""}`,
        onClick: () => handleActivate(b)
      },
       React.createElement("div", { className: "buff-emoji" }, b.emoji),
       React.createElement("div", { className: "buff-body" },  React.createElement("div", { className: "buff-name" }, b.name, locked &&  React.createElement("span", { className: "buff-level-req" }, "nv.", b.unlockLevel)),  React.createElement("div", { className: "buff-desc" }, b.desc, " \xB7 ", fmt(b.cost), " spins"), isActive &&  React.createElement("div", { className: "buff-timer-wrap" },  React.createElement("div", { className: "buff-timer-bar", style: { width: `${pct}%` } }))),
       React.createElement("div", { className: "buff-timer-label" }, isActive ? `${Math.ceil(remaining)}s` : "")
    );
  }));
}
export {
  BuffPanel as default
};
