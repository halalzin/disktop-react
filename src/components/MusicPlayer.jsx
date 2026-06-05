import React from "react";
function MusicPlayer({
  song,
  isPlaying,
  volume,
  fileError,
  onTogglePlay,
  onPrev,
  onNext,
  onVolumeChange
}) {
  const volumeIcon = volume === 0 ? "\u{1F507}" : volume < 0.4 ? "\u{1F509}" : "\u{1F50A}";
  const pct = Math.round(volume * 100);
  return  React.createElement("div", { className: "music-player" },  React.createElement("div", { className: "music-player-top" },  React.createElement("div", { className: "music-icon" }, song?.emoji ?? "\u{1F3B5}"),  React.createElement("div", { className: "music-info" },  React.createElement("div", { className: "music-title" }, song?.title ?? "\u2014"),  React.createElement("div", { className: "music-artist" }, song?.artist ?? "\u2014"), fileError &&  React.createElement("div", { style: { fontSize: 9, color: "var(--salmon)", marginTop: 2 } }, "\u26A0 Arquivo n\xE3o encontrado \u2014 veja public/music/")),  React.createElement("div", { className: "music-controls" },  React.createElement("button", { className: "music-btn", onClick: onPrev, "aria-label": "Anterior" }, "\u23EE"),  React.createElement(
    "button",
    {
      className: `music-btn${isPlaying ? " playing" : ""}`,
      onClick: onTogglePlay,
      "aria-label": isPlaying ? "Pausar" : "Tocar"
    },
    isPlaying ? "\u23F8" : "\u25B6"
  ),  React.createElement("button", { className: "music-btn", onClick: onNext, "aria-label": "Pr\xF3xima" }, "\u23ED"))),  React.createElement("div", { className: "volume-row" },  React.createElement("span", { className: "volume-icon", "aria-hidden": "true" }, volumeIcon),  React.createElement(
    "input",
    {
      type: "range",
      className: "volume-slider",
      min: "0",
      max: "1",
      step: "0.01",
      value: volume,
      onChange: (e) => onVolumeChange(parseFloat(e.target.value)),
      "aria-label": "Volume"
    }
  ),  React.createElement("span", { className: "volume-pct" }, pct, "%")));
}
export {
  MusicPlayer as default
};
