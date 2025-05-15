/* global $ */

import { Howl } from "howler";

export const win = new Howl({
  src: ["assets/win-effect.mp3"]
});

export const bg = new Howl({
  src: ["assets/bgm30s.m4a"],
  loop: true,
  volume: 0.2
});

export const click4 = new Howl({
  src: ["assets/click4.wav"],
});

export const click5 = new Howl({
  src: ["assets/click5.wav"],
});
