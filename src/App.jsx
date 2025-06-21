/* eslint-disable react/prop-types */
import { useState } from "react";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: lines[i] }; // Kembalikan pemenang dan kombinasi garis
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay, reset }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : null;

  let status = "";
  if (winner) {
    status = `The Winner is ${winner}!`;
  } else if (!squares.includes(null)) {
    status = "It's a Draw!";
  } else {
    status = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="board-detail">
      <h2>
        Tic <span style={{ color: "blue" }}>~</span>
        <span className="x"> X</span>
        <span className="o">O</span> <span style={{ color: "red" }}>~</span> Toe
      </h2>
      <div className="board">
        {squares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
        {winningLine && (
          <div
            className="highlight-line"
            style={calculateLineStyle(winningLine)}
          />
        )}
      </div>
      <div className="status">
        <div className="status-info">{status}</div>
        <div className="reset">{reset}</div>
      </div>
    </div>
  );
}

function calculateLineStyle(line) {
  const diagonalStyles = {
    "0,4,8": {
      width: "406px",
      height: "6px",
      top: "3px",
      left: "8px",
      transform: "rotate(44deg)",
      transformOrigin: "left center",
      backgroundColor: "#48C9B0",
    },
    "2,4,6": {
      width: "409px",
      height: "6px",
      top: "3px",
      right: "8px",
      transform: "rotate(-44deg)",
      transformOrigin: "right center",
      backgroundColor: "#48C9B0",
    },
  };

  const horizontalAndVerticalStyles = {
    "0,1,2": {
      top: "47px",
      left: "0px",
      width: "305px",
      height: "6px",
      backgroundColor: "#48C9B0",
    },
    "3,4,5": {
      top: "142px",
      left: "0px",
      width: "305px",
      height: "6px",
      backgroundColor: "#48C9B0",
    },
    "6,7,8": {
      top: "245px",
      left: "0px",
      width: "305px",
      height: "6px",
      backgroundColor: "#48C9B0",
    },
    "0,3,6": {
      top: "0px",
      left: "47px",
      width: "6px",
      height: "295px",
      backgroundColor: "#48C9B0",
    },
    "1,4,7": {
      top: "0px",
      left: "152px",
      width: "6px",
      height: "295px",
      backgroundColor: "#48C9B0",
    },
    "2,5,8": {
      top: "0px",
      left: "257px",
      width: "6px",
      height: "295px",
      backgroundColor: "#48C9B0",
    },
  };

  const lineKey = line.join(",");
  return diagonalStyles[lineKey] || horizontalAndVerticalStyles[lineKey];
}

function Square({ value, onSquareClick }) {
  const colorClass =
    value === "X" ? "x-square" : value === "O" ? "o-square" : "";
  return (
    <button className={`square ${colorClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  const moves = history.map((squares, move) => {
    let description = "";
    if (move > 0) {
      description = "Go to Move #" + move;
    } else {
      description = "Reset";
    }

    const isActive = currentMove === move && move !== 0;
    return (
      <div className="info" key={move}>
        <button
          className={`button ${
            move === 0 ? "reset-button" : isActive ? "active" : ""
          }`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </div>
    );
  });

  const reset = moves[0];
  const otherMoves = moves.slice(1);

  return (
    <>
      <div className="game">
        <div className="game-board">
          <div className="board-info">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
              reset={reset}
            />
          </div>
        </div>
        <div className="game-info">{otherMoves}</div>
      </div>
      <div className="footer">
        &copy; 2025 Tic Tac Toe | All Rights Reserved
      </div>
    </>
  );
}
