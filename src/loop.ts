import type { Game } from "./game";

const FRAME_SIZE = (1.0 / 60.0) * 1000.0;

export class GameLoop {
  lastFrame: number;
  accumulatedDelta: number;
  requestId: number;
  game: Game;

  constructor(game: Game) {
    this.lastFrame = performance.now();
    this.accumulatedDelta = 0;
    this.requestId = 0;
    this.game = game;
  }

  start() {
    const loop = (pref: number) => {
      this.accumulatedDelta += pref - this.lastFrame;
      while (this.accumulatedDelta > FRAME_SIZE) {
        this.game.update();
        this.accumulatedDelta -= FRAME_SIZE;
      }
      this.lastFrame = pref;
      this.game.draw();
      this.requestId = requestAnimationFrame(loop);
    };
    this.requestId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.requestId);
  }
}
