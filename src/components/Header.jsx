import React from "react";
function Header({ song, theme, onToggleTheme }) {
  const short = song ? `${song.emoji} ${song.artist} \u2013 ${song.title.slice(0, 22)}${song.title.length > 22 ? "\u2026" : ""}` : "";
  return  React.createElement("header", { className: "header" },  React.createElement("div", { className: "logo" }, "Disk",  React.createElement("span", null, "Top")),  React.createElement("div", { className: "header-right" },  React.createElement("span", { className: "now-playing" }, short),  React.createElement(
    "button",
    {
      className: "btn-icon",
      onClick: onToggleTheme,
      title: "Alternar tema",
      "aria-label": "Alternar modo escuro"
    },
    theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"
  )));
}
export {
  Header as default
};
