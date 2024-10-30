import { Game } from "./game";
import puzzle from "./puzzle.png";

export function indexToCoordinate(index: number) {
  return { x: index % 3, y: Math.floor(index / 3) };
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function resizeImage(img: HTMLImageElement, size: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);
  return canvas;
}

export class Puzzle extends Game {
  image: HTMLCanvasElement = document.createElement("canvas");
  tiles = [4, 2, 6, 1, 5, null, 8, 3, 7];

  async initialize(): Promise<void> {
    const img = await loadImage(puzzle);
    this.image = resizeImage(img, this.canvas.width);
  }

  draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.tiles.forEach(this.drawTile.bind(this));
  }

  update(): void {}

  private drawTile(tile: number | null) {
    const idx = this.tiles.indexOf(tile);
    if (idx === -1 || tile === null) return;
    const { x, y } = indexToCoordinate(idx);
    const { x: vx, y: vy } = indexToCoordinate(tile);
    const size = this.canvas.width / 3;
    this.context.drawImage(
      this.image,
      vx * size,
      vy * size,
      size,
      size,
      x * size,
      y * size,
      size,
      size,
    );
  }
}
