import React from "react";
import { UPGRADES } from "../data/upgrades.js";
import { upgradeCost } from "../hooks/useGameState.js";
import { fmt } from "../utils/fmt.js";
function UpgradePanel({ upgrades, spins, onBuy, onToast }) {
  function handleBuy(u) {
    const owned = upgrades[u.id] || 0;
    if (owned >= u.maxOwned) {
      onToast("\u2705 Upgrade no n\xEDvel m\xE1ximo!");
      return;
    }
    const cost = upgradeCost(u.id, owned);
    if (spins < cost) {
      onToast("\u274C Spins insuficientes!", "error");
      return;
    }
    onBuy(u.id);
    onToast(`${u.emoji} ${u.name} comprado! (${owned + 1}/${u.maxOwned})`);
  }
  return  React.createElement("div", { className: "upgrade-list" }, UPGRADES.map((u) => {
    const owned = upgrades[u.id] || 0;
    const isMaxed = owned >= u.maxOwned;
    const cost = upgradeCost(u.id, owned);
    const canAfford = !isMaxed && spins >= cost;
    return  React.createElement(
      "div",
      {
        key: u.id,
        className: `upgrade-card${isMaxed ? " maxed" : !canAfford ? " locked" : ""}`,
        onClick: () => handleBuy(u)
      },
       React.createElement("div", { className: "upgrade-icon" }, u.emoji),
       React.createElement("div", { className: "upgrade-info" },  React.createElement("div", { className: "upgrade-name" }, u.name, owned > 0 &&  React.createElement("span", { className: "upgrade-owned-badge" }, owned, "/", u.maxOwned)),  React.createElement("div", { className: "upgrade-desc" }, u.desc)),
       React.createElement("div", { className: `upgrade-cost${isMaxed ? " maxed-text" : canAfford ? " affordable" : ""}` }, isMaxed ? "MAX" : fmt(cost))
    );
  }));
}
export {
  UpgradePanel as default
};
