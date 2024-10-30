export abstract class Game {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("2d context not supported");
    }
    this.context = context;
  }
  abstract draw(): void;
  abstract update(): void;
}
