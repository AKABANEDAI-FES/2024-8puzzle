import { GameLoop } from "./loop";
import { Puzzle } from "./puzzle";
import "./style.css";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Hello, World!");
  const puzzle = document.querySelector("#puzzle")!;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  puzzle.appendChild(canvas);

  const game = new Puzzle(canvas);
  await game.initialize();
  const loop = new GameLoop(game);

  loop.start();
});
