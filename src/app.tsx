import { usePuzzle, indexToCoordinate } from "./puzzle";
import puzzle from "./puzzle.png";
import "./app.css";

export default function App() {
  const { tiles, move, isSolved } = usePuzzle();

  function Tile({ value }: { value: number | null }) {
    const { x: vx, y: vy } = indexToCoordinate((value ?? 8) - 1);
    const index = tiles.indexOf(value);
    const { x, y } = indexToCoordinate(index);

    return (
      <div
        onClick={() => move(value)}
        className="tile"
        style={{
          transform: `translate(${x * 100}%, ${y * 100}%)`,
        }}
        data-tile={String(value)}
      >
        {value !== null && (
          <div
            style={{
              backgroundImage: `url(${puzzle})`,
              backgroundPosition: `${-vx * 100}% ${-vy * 100}%`,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div id="puzzle" data-solved={isSolved() ? "" : undefined}>
      {tiles.map((value) => (
        <Tile key={value} value={value} />
      ))}
    </div>
  );
}
