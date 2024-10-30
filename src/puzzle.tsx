import { useEffect, useRef, useState } from "react";

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

export function usePuzzle() {
  const [tiles, setTiles] = useState([4, 2, 6, 1, 5, null, 8, 3, 7]);

  function move(value: number | null) {
    if (value === null) {
      return;
    }

    const index = tiles.indexOf(value);
    const emptyIndex = tiles.indexOf(null);
    const position = indexToCoordinate(index);
    const validMoves = [
      { x: position.x - 1, y: position.y },
      { x: position.x + 1, y: position.y },
      { x: position.x, y: position.y - 1 },
      { x: position.x, y: position.y + 1 },
    ]
      .filter((pos) => pos.x >= 0 && pos.x < 3 && pos.y >= 0 && pos.y < 3)
      .map((pos) => pos.y * 3 + pos.x);

    if (validMoves.includes(emptyIndex)) {
      const newTiles = [...tiles];
      newTiles[emptyIndex] = value;
      newTiles[index] = null;
      setTiles(newTiles);
    }
  }

  function isSolved() {
    return tiles.slice(0, 8).every((val, i) => val === i + 1);
  }

  function renderPuzzle(imgUrl: string) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => {
      loadImage(imgUrl)
        .then((img) => resizeImage(img, 1080))
        .then((img) => {
          setImage(img);
        });
    }, []);

    useEffect(() => {
      const ctx = ref.current?.getContext("2d");
      if (!ctx || !image) return;
      const render = async (
        ctx: CanvasRenderingContext2D,
        image: HTMLCanvasElement,
      ) => {
        ctx.clearRect(0, 0, 1080, 1080);
        if (isSolved()) {
          ctx.drawImage(image, 0, 0);
          return;
        }
        for (let idx = 0; idx < 9; idx++) {
          const value = tiles[idx];
          if (value === null) continue;
          const { x, y } = indexToCoordinate(idx);
          const { x: vx, y: vy } = indexToCoordinate(value - 1);
          ctx.drawImage(
            image,
            vx * 360,
            vy * 360,
            360,
            360,
            x * 360,
            y * 360,
            360,
            360,
          );
        }
      };
      render(ctx, image);
    }, [tiles, image]);

    const handleClick = (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const h = rect.height / 3;
      const w = rect.width / 3;
      const x = Math.floor((e.clientX - rect.left) / w);
      const y = Math.floor((e.clientY - rect.top) / h);
      const idx = y * 3 + x;
      move(tiles[idx]);
    };

    return (
      <canvas ref={ref} width={1080} height={1080} onClick={handleClick} />
    );
  }

  return { tiles, move, isSolved, renderPuzzle };
}
