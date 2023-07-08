import { useState } from "react";

export default function Game() {
  //history is an array of arrays of size 9 filled with null at the start
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //keeps track of move number so can jump to it, starts at 0 since nothing happened yet/is game start
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;

  //goes to move we want to, not ncessarily next one which is last batch of squares in history
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    //IF choose to do a new move after going back in time or just do next move
    //sets new history to everything up to move we want to jump to plus 1 because end is exclusive
    //slice is shallow copy (reference) and need deep copy, so ...added to slice to get fully deep copy
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);

    //current move number is next one with new squares added
    setCurrentMove(nextHistory.length - 1);
  }

  //function to handle jumping to a move
  function jumpTo(nextMove) {
    //set current move to the move we want to jump to
    setCurrentMove(nextMove);
    //set xIsNext to true if even (ex. 0th turn and then 2nd), have to do separately
    //bc othewise will go with opposite of before x which wasn't move before this in time travel version
    //do nothing else bc if press something, handlePlay with handle
  }

  //below writing functino for how to map
  //creating a list of buttons with descriptions
  //squares is each list of squares at a turn and move is the number (order) of the move
  const moves = history.map((squares, move) => {
    let description;
    //cause move 0 is before first turn
    if (move > 0) {
      description = "Go to move #" + move;
    }
    //is move 0, so go to start
    else {
      description = "Go to move #" + move;
    }
    return (
      //key helps a lot bc helps react be able to keep track of changes
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
//export means accessible outside function
//default means other files are told this is main function
//take in three props bc Game will control these
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //with no params, slice makes a copy of whole array
    const nextSquares = squares.slice();
    //sets to right thing based on whose turn it is

    //if is not null as is by default, it is already filled
    //if there is already a winner, then don't do anything when clicked
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    //call this so game can control updating the board, XisNext, and history
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status; //changable variable

  if (winner == "T") {
    status = "Tie";
  }
  //otherwise if there is a winner (and it's not t as checked above), show it
  else if (winner) {
    status = "Winner: " + winner;
  } else {
    //no winner yet so show next turn
    //if x is next, status has x, else has O
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  //all possible winning combinations
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
    //smart way to check winner is just by seeing if is same and then returning that literal one
    //first part checks it's not null, because that means not filled in yet
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; //because that's the winner
    }
  }

  //funtions by default return null, so if no winner, will be null

  //but if not winner, still could be tie so check here

  //quick check if every square is filled, then it is a tie
  //just square checking here is same as square != null
  if (squares.every((square) => square)) {
    return "T";
  }
}
//pass in a value and function for click as javascript parameters (props)
//notice how each square has its own value
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
