const imageUrl = "puzzle.png";

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  const tiles = [4, 2, 6, 1, 5, null, 8, 3, 7];

  const puzzleElm = document.querySelector("#puzzle");

  function indexToPosition(index: number) {
    return { x: index % 3, y: Math.floor(index / 3) };
  }

  function createTile(value: number | null) {
    const tile = document.createElement("div");
    const img = document.createElement("div");
    const { x, y } = indexToPosition(tiles.indexOf(value));
    tile.className = "tile";
    if (value) {
      const { x, y } = indexToPosition(value - 1);
      img.style.backgroundImage = `url(${imageUrl})`;
      img.style.backgroundPosition = `${-x * 100}% ${-y * 100}%`;
    }
    tile.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
    tile.appendChild(img);
    value && tile.addEventListener("click", () => moveTile(value));
    tile.setAttribute("data-tile", String(value));
    return tile;
  }

  function renderPuzzle() {
    puzzleElm!.innerHTML = "";
    tiles.forEach((value) => puzzleElm!.appendChild(createTile(value)));
  }

  function moveTile(value: number) {
    const index = tiles.indexOf(value);
    const emptyIndex = tiles.indexOf(null);
    const position = indexToPosition(index);
    const validMoves = [
      { x: position.x - 1, y: position.y },
      { x: position.x + 1, y: position.y },
      { x: position.x, y: position.y - 1 },
      { x: position.x, y: position.y + 1 },
    ]
      .filter((pos) => pos.x >= 0 && pos.x < 3 && pos.y >= 0 && pos.y < 3)
      .map((pos) => pos.y * 3 + pos.x);

    if (validMoves.includes(emptyIndex)) {
      [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
      renderPuzzle();
    }

    if (isSolved()) {
      puzzleElm!.setAttribute("data-solved", "");
    }
  }

  function isSolved() {
    return tiles.slice(0, 8).every((val, i) => val === i + 1);
  }

  renderPuzzle();
});

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  e.returnValue = "";
});
