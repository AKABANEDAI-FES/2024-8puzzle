import { useState } from "react";

export function indexToCoordinate(index: number) {
  return { x: index % 3, y: Math.floor(index / 3) };
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

  return { tiles, move, isSolved };
}
