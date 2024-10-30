import { Game } from "./game";
import puzzle from "./puzzle.png";

type Rect = {
  x: number;
  y: number;
};

export function indexToCoordinate(index: number): Rect {
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
  tiles = [
    [4, 2, 6],
    [1, 5, null],
    [8, 3, 7],
  ];
  animatedTile: Rect | null = null;
  progress = 0;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.canvas.addEventListener("click", this.handleClick.bind(this));
  }

  get empty() {
    return indexToCoordinate(this.tiles.flat().indexOf(null));
  }

  get isSolved(): boolean {
    return this.tiles.flat().every((value, index) => {
      return value === null || value === index + 1;
    });
  }

  async initialize(): Promise<void> {
    const img = await loadImage(puzzle);
    this.image = resizeImage(img, this.canvas.width);
  }

  draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.isSolved) {
      this.context.drawImage(this.image, 0, 0);
    } else {
      this.tiles.forEach((row, y) => {
        row.forEach((value, x) => {
          this.drawTile(value, x, y);
        });
      });
    }
  }

  update(): void {
    if (this.animatedTile === null) {
      return;
    }
    this.progress += 0.1;
    if (this.progress >= 1) {
      this.swapTiles(this.animatedTile.x, this.animatedTile.y);
      this.animatedTile = null;
      this.progress = 0;
    }
  }

  private move(x: number, y: number): void {
    if (this.animatedTile || !this.isAdjacentToEmpty(x, y) || this.isSolved) {
      return;
    }
    this.animatedTile = { x, y };
  }

  private swapTiles(x: number, y: number): void {
    const { x: emptyX, y: emptyY } = this.empty;
    const temp = this.tiles[y][x];
    this.tiles[y][x] = null;
    this.tiles[emptyY][emptyX] = temp;
  }

  private isAdjacentToEmpty(x: number, y: number): boolean {
    const { x: emptyX, y: emptyY } = this.empty;
    return (
      (x === emptyX && Math.abs(y - emptyY) === 1) ||
      (y === emptyY && Math.abs(x - emptyX) === 1)
    );
  }

  private handleClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const h = rect.height / 3;
    const w = rect.width / 3;
    const x = Math.floor((e.clientX - rect.left) / w);
    const y = Math.floor((e.clientY - rect.top) / h);
    this.move(x, y);
  }

  private drawTile(value: number | null, col: number, row: number): void {
    if (value === null) {
      return;
    }
    const size = this.canvas.width / 3;
    const { x: sx, y: sy } = indexToCoordinate(value - 1);
    let offset = { x: 0, y: 0 };
    if (
      this.animatedTile &&
      this.animatedTile.x === col &&
      this.animatedTile.y === row
    ) {
      const { x: ex, y: ey } = this.empty;
      offset = {
        x: (ex - col) * size * this.progress,
        y: (ey - row) * size * this.progress,
      };
    }
    this.context.drawImage(
      this.image,
      sx * size,
      sy * size,
      size,
      size,
      col * size + offset.x,
      row * size + offset.y,
      size,
      size
    );
  }
}
