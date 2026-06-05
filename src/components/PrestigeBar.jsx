import React from "react";
function PrestigeBar({ prestige, prestigeBonus }) {
  const pBonus = Math.round((prestigeBonus - 1) * 100);
  return  React.createElement("div", { className: "prestige-bar" },  React.createElement("span", { className: "prestige-badge" }, "PREST\xCDGIO ", prestige),  React.createElement("span", null, pBonus > 0 ? `B\xF4nus permanente ativo: +${pBonus}% em todos os spins!` : "Gire o disco para acumular Spins e subir de n\xEDvel!"));
}
export {
  PrestigeBar as default
};
