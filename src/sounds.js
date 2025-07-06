import { Howl } from "howler";

export const sounds = {
  spin:     new Howl({ src: ["/sounds/spin.mp3"], volume: 0.4 }),
  reelStop: new Howl({ src: ["/sounds/reel_stop.mp3"], volume: 0.4 }),
  win:      new Howl({ src: ["/sounds/win.mp3"], volume: 0.6 }),
  bonus:    new Howl({ src: ["/sounds/bonus.mp3"], volume: 0.6 }),
  purchase: new Howl({ src: ["/sounds/purchase.mp3"], volume: 0.5 })
};