import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';


// Fisher-Yates shuffle source: https://bost.ocks.org/mike/shuffle/
function initializeTiles() {
  var tileArr = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"];
  var index = tileArr.length;
  var temp = "";
  var pick = "";

  while (index) {
    // pick random element
    pick = Math.floor(Math.random() * index--);

    // swap that element with current index
    temp = tileArr[pick];
    tileArr[pick] = tileArr[index];
    tileArr[index] = temp;
  }

  return tileArr;
}

function initializeRevealed(){
   return Array(16).fill(false);
}

function initializeMatched(){
   return Array(16).fill(false);
} 

export default function memory_game(root){
   ReactDOM.render(<Game />, root);
}

function Tile(props) {
   var label = props.revealed ? props.value : "⚓";
   var className = props.matched ? "tile-matched" : "tile-unmatched";
   var onClick = props.revealed ? null : props.onClick;

   return (
      <button className={className} onClick={onClick} enabled={props.matched.toString()}>
         {label}
      </button>
   );
}

class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
         tileOrder: initializeTiles(),
         tileRevealed: initializeRevealed(),
         tileMatched: initializeMatched(),
         score: 0,
         firstTileRevealed: -1,
         secondTileRevealed: -1
      };
   }

   render() {
      return (
         <div className="game">
            <div className="tile-board">
               <Board
                  tileOrder={this.state.tileOrder}
                  tileRevealed={this.state.tileRevealed}
                  tileMatched={this.state.tileMatched}
                  onClick={n => this.handleClick(n)}
               />
            </div>
            <button onClick={() => location.reload()}>
               Restart
            </button>
            <h>Score {this.state.score}</h>
         </div>
      );
   }
   
   handleClick(index){
      var tileOrder = this.state.tileOrder;
      var tempTileRevealed = this.state.tileRevealed;
      var tempTileMatched = this.state.tileMatched;
      var tempScore = this.state.score;
      var tempFirstTileRevealed = this.state.firstTileRevealed;
      var tempSecondTileRevealed = this.state.secondTileRevealed;

      tempScore++;
      // matching has not begun
      if(this.state.firstTileRevealed == -1){
         tempTileRevealed[index] = true;
         tempFirstTileRevealed = index;
      }
      // first tile clicked already, clicking second
      else if(this.state.firstTileRevealed != -1 && this.state.secondTileRevealed == -1){
         tempTileRevealed[index] = true;
         // match found
         if(tileOrder[this.state.firstTileRevealed] == tileOrder[index]){
            tempTileMatched[this.state.firstTileRevealed] = true;
            tempTileMatched[index] = true;
            tempFirstTileRevealed = -1;
            tempSecondTileRevealed = -1;
         }
         else{
            tempSecondTileRevealed = index;
            this.setState({
               tileOrder: tileOrder,
               tileRevealed: tempTileRevealed,
               tileMatched: tempTileMatched,
               score: tempScore,
               firstTileRevealed: tempFirstTileRevealed,
               secondTileRevealed: tempSecondTileRevealed
            });

            var parent = this;

            setTimeout(function(){
               tempTileRevealed[tempFirstTileRevealed] = false;
               tempTileRevealed[tempSecondTileRevealed] = false;
               tempFirstTileRevealed = -1;
               tempSecondTileRevealed = -1;

               parent.setState({
                  tileOrder: tileOrder,
                  tileRevealed: tempTileRevealed,
                  tileMatched: tempTileMatched,
                  score: tempScore,
                  firstTileRevealed: tempFirstTileRevealed,
                  secondTileRevealed: tempSecondTileRevealed
               });    
            }, 1500);
         }
      }
      this.setState({
         tileOrder: tileOrder,
         tileRevealed: tempTileRevealed,
         tileMatched: tempTileMatched,
         score: tempScore,
         firstTileRevealed: tempFirstTileRevealed,
         secondTileRevealed: tempSecondTileRevealed
      });     
   }
}

class Board extends React.Component {
   renderTile(n) {
      return (
         <Tile
            value = {this.props.tileOrder[n]}
            revealed = {this.props.tileRevealed[n]}
            matched = {this.props.tileMatched[n]}
            index = {n}
            onClick = {() => this.props.onClick(n)}
         />
      );
   }

   render() {
      return (
         <div>
            <div className="board-row">
               {this.renderTile(0)}
               {this.renderTile(1)}
               {this.renderTile(2)}
               {this.renderTile(3)}
            </div>
            <div className="board-row">
               {this.renderTile(4)}
               {this.renderTile(5)}
               {this.renderTile(6)}
               {this.renderTile(7)}
            </div>
            <div className="board-row">
               {this.renderTile(8)}
               {this.renderTile(9)}
               {this.renderTile(10)}
               {this.renderTile(11)}
            </div>
            <div className="board-row">
               {this.renderTile(12)}
               {this.renderTile(13)}
               {this.renderTile(14)}
               {this.renderTile(15)}
            </div>
         </div>
      );
   }
}


