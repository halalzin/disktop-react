import React from "react";
function PrestigeModal({ prestige, onConfirm, onCancel }) {
  const nextBonus = Math.round((prestige + 1) * 0.25 * 100);
  return  React.createElement("div", { className: "modal-overlay", onClick: (e) => {
    if (e.target === e.currentTarget) onCancel();
  } },  React.createElement("div", { className: "modal-box" },  React.createElement("span", { className: "modal-icon" }, "\u2726"),  React.createElement("div", { className: "modal-title" }, "Prest\xEDgio ", prestige + 1),  React.createElement("div", { className: "modal-desc" }, "Voc\xEA atingiu o n\xEDvel m\xE1ximo!",  React.createElement("br", null), "Reinicie com um b\xF4nus permanente de", " ",  React.createElement("span", { className: "modal-highlight" }, "+", nextBonus, "% em todos os spins"), " ", "e desbloqueie uma skin exclusiva.",  React.createElement("br", null),  React.createElement("br", null), "Spins e upgrades ser\xE3o ",  React.createElement("strong", null, "zerados"), ", mas", " ",  React.createElement("strong", null, "prest\xEDgio e skins permanecem"), "."),  React.createElement("div", { className: "modal-actions" },  React.createElement("button", { className: "btn-primary", onClick: onConfirm }, "\u2726 Confirmar Prest\xEDgio"),  React.createElement("button", { className: "btn-secondary", onClick: onCancel }, "Cancelar"))));
}
export {
  PrestigeModal as default
};
