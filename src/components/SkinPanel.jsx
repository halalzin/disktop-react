import React from "react";
import { useState } from "react";
import { SKINS } from "../data/skins.js";
import { fmt } from "../utils/fmt.js";
function SkinPreview({ skin }) {
  return  React.createElement("svg", { className: "skin-preview", viewBox: "0 0 50 50", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" },  React.createElement("circle", { cx: "25", cy: "25", r: "24", fill: "#111" }),  React.createElement("circle", { cx: "25", cy: "25", r: "20", fill: "none", stroke: "#1a1a1a", strokeWidth: "1" }),  React.createElement("circle", { cx: "25", cy: "25", r: "15", fill: "none", stroke: "#181818", strokeWidth: "0.8" }),  React.createElement("circle", { cx: "25", cy: "25", r: "11", fill: skin.labelColor }),  React.createElement("circle", { cx: "25", cy: "25", r: "9.5", fill: "none", stroke: skin.labelRing, strokeWidth: "0.8" }),  React.createElement("circle", { cx: "25", cy: "25", r: "2.5", fill: "#111" }));
}
function BuyModal({ skin, onConfirm, onCancel }) {
  if (!skin) return null;
  return  React.createElement("div", { className: "modal-overlay", onClick: (e) => {
    if (e.target === e.currentTarget) onCancel();
  } },  React.createElement("div", { className: "modal-box" },  React.createElement("span", { className: "modal-icon" }, "\u{1F3A8}"),  React.createElement("div", { className: "modal-title" }, skin.name),  React.createElement("div", { className: "modal-desc" }, skin.desc,  React.createElement("br", null),  React.createElement("br", null), "Custo: ",  React.createElement("span", { className: "modal-highlight" }, fmt(skin.cost), " spins"), ".",  React.createElement("br", null), "Deseja comprar e equipar esta skin?"),  React.createElement("div", { className: "modal-actions" },  React.createElement("button", { className: "btn-primary", onClick: onConfirm }, "Comprar & Equipar"),  React.createElement("button", { className: "btn-secondary", onClick: onCancel }, "Cancelar"))));
}
function SkinPanel({
  currentSkin,
  unlockedSkins,
  prestige,
  spins,
  onEquip,
  onUnlock,
  onToast
}) {
  const [pendingSkin, setPendingSkin] = useState(null);
  function handleCard(skin) {
    const isUnlocked = unlockedSkins.includes(skin.id) || skin.prestige && prestige >= skin.prestige;
    if (isUnlocked) {
      onEquip(skin.id);
      onToast(`\u{1F3A8} Skin "${skin.name}" equipada!`);
      return;
    }
    if (skin.prestige && prestige < skin.prestige) {
      onToast(`\u{1F512} Requer ${skin.prestige}\xD7 Prest\xEDgio`, "error");
      return;
    }
    if (spins < skin.cost) {
      onToast("\u274C Spins insuficientes!", "error");
      return;
    }
    setPendingSkin(skin);
  }
  function confirmBuy() {
    onUnlock(pendingSkin.id);
    onToast(`\u{1F3A8} Skin "${pendingSkin.name}" comprada e equipada!`);
    setPendingSkin(null);
  }
  return  React.createElement(React.Fragment, null,  React.createElement("div", { className: "skin-grid" }, SKINS.map((skin) => {
    const isUnlocked = unlockedSkins.includes(skin.id) || skin.prestige && prestige >= skin.prestige;
    const isActive = currentSkin === skin.id;
    const isLocked = !isUnlocked;
    const costLabel = skin.prestige ? `\u2605${skin.prestige} prest\xEDgio` : skin.cost === 0 ? "gr\xE1tis" : fmt(skin.cost);
    return  React.createElement(
      "div",
      {
        key: skin.id,
        className: `skin-card${isActive ? " skin-active" : ""}${isLocked ? " locked" : ""}`,
        onClick: () => !isLocked && handleCard(skin)
      },
       React.createElement(SkinPreview, { skin }),
       React.createElement("div", { className: "skin-name" }, skin.name),
      isActive ?  React.createElement("div", { className: "skin-active-indicator" }, "\u25CF ATIVO") :  React.createElement("div", { className: "skin-cost" }, costLabel)
    );
  })), pendingSkin &&  React.createElement(
    BuyModal,
    {
      skin: pendingSkin,
      onConfirm: confirmBuy,
      onCancel: () => setPendingSkin(null)
    }
  ));
}
export {
  SkinPanel as default
};
