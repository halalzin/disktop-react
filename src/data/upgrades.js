const UPGRADES = [
  { id: "needle", name: "Agulha de Diamante", emoji: "\u{1F48E}", desc: "Cliques valem +1 spin extra", cost: 50, effect: "click", val: 1, maxOwned: 5 },
  { id: "turntable", name: "Toca-Discos Pro", emoji: "\u{1F39A}\uFE0F", desc: "+2 spins/seg autom\xE1tico", cost: 120, effect: "auto", val: 2, maxOwned: 5 },
  { id: "subwoofer", name: "Subwoofer Bass", emoji: "\u{1F50A}", desc: "Cliques valem +3 spins extra", cost: 350, effect: "click", val: 3, maxOwned: 3 },
  { id: "vinyl_press", name: "Prensagem Pr\xF3pria", emoji: "\u{1F3ED}", desc: "+8 spins/seg autom\xE1tico", cost: 800, effect: "auto", val: 8, maxOwned: 3 },
  { id: "golden_disc", name: "Disco de Ouro", emoji: "\u{1F3C6}", desc: "Multiplica cliques por \xD72", cost: 2e3, effect: "mult_click", val: 2, maxOwned: 1 },
  { id: "dj_booth", name: "Cabine de DJ", emoji: "\u{1F3A7}", desc: "+20 spins/seg autom\xE1tico", cost: 5e3, effect: "auto", val: 20, maxOwned: 2 },
  { id: "platinum", name: "Disco de Platina", emoji: "\u2728", desc: "Multiplica todo auto por \xD71.5", cost: 12e3, effect: "mult_auto", val: 1.5, maxOwned: 1 },
  { id: "studio", name: "Est\xFAdio Pr\xF3prio", emoji: "\u{1F3BC}", desc: "+50 spins/seg autom\xE1tico", cost: 3e4, effect: "auto", val: 50, maxOwned: 2 },
  { id: "record_label", name: "Gravadora Pr\xF3pria", emoji: "\u{1F3E2}", desc: "+150 spins/seg autom\xE1tico", cost: 1e5, effect: "auto", val: 150, maxOwned: 2 }
];
export {
  UPGRADES
};
