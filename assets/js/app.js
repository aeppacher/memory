// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

import memory_game from "./memory";

function init() {
  let root = document.getElementById('game');
  if (root) {
  	let channel = socket.channel("games:" + window.gameName, {}); 		
  	memory_game(root, channel);
  }
  
  if (document.getElementById('index-page')){
  	console.log("wee");
  	document.getElementById('sub2').onclick = function() {
    	var val = document.getElementById('game-field').value;
    	if (!val){
    		val = "demo";
    	}
    	var cleaned = val.replace(/[\W_]+/g, ' ');
    	window.location.href = '/game/' + cleaned;
    };
  }
}

$(init)

