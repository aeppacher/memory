import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function memory_game(root, channel){
   ReactDOM.render(<MemoryGame channel={channel} />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
      super(props);
      this.channel = props.channel;
      this.state = {
         tile_order_masked: Array(16).fill("⚓"),
         tile_matched: Array(16).fill(false),
         score: 0,
         first_tile_revealed: -1,
         second_tile_revealed: -1,
         delay_reset: false
      };
      this.channel.join()
          .receive("ok", this.gotView.bind(this))
          .receive("error", resp => { console.log("Ya dun goofed", resp)});
   }

   gotView(view) {
      console.log("New view", view);
      this.setState(view.game);
   }

   sendGuess(n) {
      if(this.state.delay_reset == false){
         this.channel.push("guess", {index: n})
                     .receive("ok", this.gotView.bind(this));
      }
   }

   sendRefresh(){
      console.log("weee");
      this.channel.push("refresh")
                  .receive("ok", this.gotView.bind(this));
   }

   componentDidUpdate(){
      if(this.state.delay_reset == true){
         var cent = this;
         setTimeout(function() {
            cent.sendRefresh();
         }, 1500);
      }
   }

   render() {
      //var onClick = this.state.delay_reset ? null : this.sendGuess.bind(this);
      return (
         <div className="game">
            <div className="tile-board">
               <Board
                  tile_order_masked={this.state.tile_order_masked}
                  tile_matched={this.state.tile_matched}
                  onClick={this.sendGuess.bind(this)}
                  delay={this.state.delay_reset}
               />
            </div>
            <button onClick={() => location.reload()}>
               Restart
            </button>
            <h5>Score {this.state.score}</h5>
         </div>
      );
   }
}

class Board extends React.Component {
   renderTile(n) {
      return (
         <Tile
            value = {this.props.tile_order_masked[n]}
            matched = {this.props.tile_matched[n]}
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

function Tile(props) {
   var className = props.matched ? "tile-matched" : "tile-unmatched";
   var onClick = props.value != "⚓" ? null : props.onClick;
   var enabled = !props.delay_reset && props.matched.toString();

   return (
      <button className={className} onClick={onClick} enabled={enabled}>
         {props.value}
      </button>
   );
}