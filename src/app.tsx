import { usePuzzle } from "./puzzle";
import puzzle from "./puzzle.png";
import "./app.css";

export default function App() {
  const { renderPuzzle } = usePuzzle();

  return (
    <div id="puzzle">
      {renderPuzzle(puzzle)}
    </div>
  );
}
