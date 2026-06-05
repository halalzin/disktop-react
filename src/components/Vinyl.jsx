import React from "react";
import { useState, useCallback } from "react";
import { SKINS } from "../data/skins.js";
import { fmt } from "../utils/fmt.js";
let _burstId = 0;
function Vinyl({ currentSkinId, speed = "medium", clickValue, onVinylClick }) {
  const [bursts, setBursts] = useState([]);
  const [rings, setRings] = useState([]);
  const skin = SKINS.find((s) => s.id === currentSkinId) ?? SKINS[0];
  const spinClass = {
    slow: "vinyl-slow",
    medium: "vinyl-medium",
    fast: "vinyl-fast"
  }[speed] ?? "vinyl-medium";
  const handleClick = useCallback((e) => {
    onVinylClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++_burstId;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBursts((prev) => [...prev, { id, x, y, val: fmt(clickValue) }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 700);
    const rid = ++_burstId;
    setRings((prev) => [...prev, rid]);
    setTimeout(() => setRings((prev) => prev.filter((r) => r !== rid)), 450);
  }, [onVinylClick, clickValue]);
  return  React.createElement(
    "div",
    {
      className: "vinyl-wrap",
      onClick: handleClick,
      role: "button",
      tabIndex: 0,
      "aria-label": "Clique para girar o disco",
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }
    },
     React.createElement(
      "svg",
      {
        className: `vinyl-svg ${spinClass}`,
        viewBox: "0 0 200 200",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-hidden": "true"
      },
       React.createElement("circle", { cx: "100", cy: "100", r: "98", fill: "#111", stroke: "#222", strokeWidth: "1.5" }),
      [90, 82, 74, 66, 58, 50, 43].map((r, i) =>  React.createElement("circle", { key: i, cx: "100", cy: "100", r, fill: "none", stroke: i % 2 === 0 ? "#1c1c1c" : "#191919", strokeWidth: r > 60 ? 1 : 0.8 })),
       React.createElement("circle", { cx: "100", cy: "100", r: "40", fill: skin.labelColor }),
       React.createElement("circle", { cx: "100", cy: "100", r: "36", fill: "none", stroke: skin.labelRing, strokeWidth: "1" }),
       React.createElement("text", { x: "100", y: "96", textAnchor: "middle", fontFamily: "'Bebas Neue',sans-serif", fontSize: "11", fill: skin.textColor }, skin.text1),
       React.createElement("text", { x: "100", y: "109", textAnchor: "middle", fontFamily: "'DM Sans',sans-serif", fontSize: "7", fill: skin.textColor }, skin.text2),
       React.createElement("circle", { cx: "100", cy: "100", r: "5", fill: "#111", stroke: "#2a2a2a", strokeWidth: "1" }),
       React.createElement("circle", { cx: "100", cy: "100", r: "2.5", fill: "#0a0a0a" }),
       React.createElement("ellipse", { cx: "78", cy: "72", rx: "10", ry: "6", fill: "rgba(255,255,255,0.04)", transform: "rotate(-30 78 72)" })
    ),
    bursts.map((b) =>  React.createElement("div", { key: b.id, className: "click-burst", style: { left: b.x, top: b.y } }, "+", b.val)),
    rings.map((r) =>  React.createElement("div", { key: r, className: "vinyl-ring-pulse" }))
  );
}
export {
  Vinyl as default
};
