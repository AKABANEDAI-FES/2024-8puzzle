const imageUrl = "puzzle.png";

document.addEventListener("DOMContentLoaded", () => {
  // const tiles = [...Array(15).keys()].map((x) => x + 1).concat(null);
  const tiles = [4, 2, 6, 1, 5, null, 8, 3, 7];

  const puzzleElm = document.querySelector("#puzzle");

  function indexToPosition(index) {
    return { x: index % 3, y: Math.floor(index / 3) };
  }

  function createTile(value) {
    const tile = document.createElement("div");
    const { x, y } = indexToPosition(tiles.indexOf(value));
    tile.className = "tile";
    let bgStyle = "";
    if (value) {
      const { x, y } = indexToPosition(value - 1);
      const bgImage = `background-image: url(${imageUrl});`;
      const bgPosition = `background-position: ${-x * 100}% ${-y * 100}%;`;
      bgStyle = `${bgImage} ${bgPosition}`;
    }
    tile.style = `transform: translate(${x * 100}%, ${y * 100}%); ${bgStyle}`;
    tile.addEventListener("click", () => moveTile(value));
    tile.setAttribute("data-tile", value);
    return tile;
  }

  function renderPuzzle() {
    puzzleElm.innerHTML = "";
    tiles.forEach((value) => puzzleElm.appendChild(createTile(value)));
  }

  function moveTile(value) {
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
      puzzleElm.setAttribute("data-solved", "");
    }
  }

  function isSolved() {
    return tiles.slice(0, 8).every((val, i) => val === i + 1);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  renderPuzzle();
});
