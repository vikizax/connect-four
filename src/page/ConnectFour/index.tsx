import { useReducer } from "react";
import { Column } from "../../components/Column";

const NUM_COLS = 7;
const NUM_ROWS = 6;
const NUM_TO_WIN = 4;

type BoardStateType = {
  board: (number | null)[][];
  currentPlayer: number;
  winner: number | null;
  isGameOver: boolean;
};

type ReducerActionType =
  | {
      type: "restart";
    }
  | {
      type: "move";
      colIndex: number;
    };

function genEmptyState(): BoardStateType {
  return {
    board: Array<number | null>(NUM_COLS)
      .fill(null)
      .map(() => Array<number | null>(NUM_ROWS).fill(null)),
    currentPlayer: 1,
    winner: null,
    isGameOver: false,
  };
}

function reducer(
  state: BoardStateType,
  action: ReducerActionType
): BoardStateType {
  switch (action.type) {
    case "restart":
      return genEmptyState();
    case "move":
      const relevantCol = state.board[action.colIndex];
      const colIsFull = relevantCol[0] !== null;
      if (state.isGameOver || colIsFull) return state;

      const { board, currentPlayer } = state;
      const boardClone = [...board];
      const colClone = [...relevantCol];

      const rowIndex = colClone.lastIndexOf(null);
      colClone[rowIndex] = currentPlayer;
      boardClone[action.colIndex] = colClone;

      const horizontalWin = didWin(
        rowIndex,
        action.colIndex,
        0,
        1,
        boardClone,
        currentPlayer
      );

      const verticalWin = didWin(
        rowIndex,
        action.colIndex,
        1,
        0,
        boardClone,
        currentPlayer
      );

      const diagonalRightWin = didWin(
        rowIndex,
        action.colIndex,
        1,
        1,
        boardClone,
        currentPlayer
      );

      const diagonalLeftWin = didWin(
        rowIndex,
        action.colIndex,
        -1,
        1,
        boardClone,
        currentPlayer
      );

      const isBoardFull = boardClone.every((col) =>
        col.every((row) => row !== null)
      );

      const win =
        horizontalWin || verticalWin || diagonalLeftWin || diagonalRightWin;

      console.log({ isBoardFull });

      return {
        board: boardClone,
        currentPlayer: currentPlayer === 1 ? 2 : 1,
        winner: win ? currentPlayer : null,
        isGameOver: win || isBoardFull ? true : false,
      };
    default:
      throw new Error("Unexpected action type");
  }
}

function didWin(
  startingRow: number,
  startingColumn: number,
  rowIncrement: number,
  colIncrement: number,
  board: (number | null)[][],
  currentPlayer: number
) {
  let occurance = 0;
  let curRow = startingRow;
  let curCol = startingColumn;

  // forward
  while (
    curCol < NUM_COLS &&
    curRow < NUM_ROWS &&
    board[curCol][curRow] === currentPlayer
  ) {
    occurance += 1;
    curRow += rowIncrement;
    curCol += colIncrement;
  }

  curRow = startingRow - rowIncrement;
  curCol = startingColumn - colIncrement;

  // reverse
  while (
    curCol >= 0 &&
    curRow >= 0 &&
    board[curCol][curRow] === currentPlayer
  ) {
    occurance += 1;
    curRow -= rowIncrement;
    curCol -= colIncrement;
  }
  return occurance >= NUM_TO_WIN;
}

export const ConnectFour = () => {
  const [{ board, isGameOver, winner, currentPlayer }, dispatchBoard] =
    useReducer(reducer, genEmptyState());
  console.log({ isGameOver, winner });
  return (
    <div className="container">
      <h1>
        {winner
          ? `Player ${winner} Wins`
          : !isGameOver
          ? `Player ${currentPlayer} Turn`
          : "Game Over!"}
      </h1>
      <div className="board">
        {board.map((col, idx) => {
          const onClick = () => {
            if (isGameOver) return;
            dispatchBoard({ type: "move", colIndex: idx });
          };
          return <Column key={idx} entries={col} onClick={onClick} />;
        })}
      </div>
      {isGameOver && (
        <button
          onClick={() => {
            dispatchBoard({ type: "restart" });
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
};
