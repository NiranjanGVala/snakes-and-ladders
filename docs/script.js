(()=>{"use strict";var e={};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{var n;e.g.importScripts&&(n=e.g.location+"");var t=e.g.document;if(!n&&t&&(t.currentScript&&(n=t.currentScript.src),!n)){var i=t.getElementsByTagName("script");i.length&&(n=i[i.length-1].src)}if(!n)throw new Error("Automatic publicPath is not supported in this browser");n=n.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=n})(),e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p,e.p;const n=document.getElementById("game-container"),t={speech:!0,players:[],currentPlayer:{},index:0,mode:"init",loading:!1,currentSound:!1,movingPieceSound:!1,rollingDiceSound:!1,ladderSounds:{},snakeSounds:{},overHundredSounds:{},winSounds:{}},i=new class{constructor(){this.voices=[]}#e=window.speechSynthesis;#n=!1;#t={};#i(){return new Promise((async(e,n)=>{this.voices=this.#e.getVoices(),this.voices=this.voices.filter((e=>(e.default&&(this.#t.lang=e.lang,this.#t.voice=e),/en/.test(e.lang)))),this.#n=!0,e()}))}speak(e,n){return this.#e.cancel(),new Promise((async(i,r)=>{if(t.speech){this.#n=this.#n?this.#n:await this.#i(),void 0!==speechSynthesis.onvoiceschanged&&(speechSynthesis.onvoiceschanged=await this.#i);let t=new SpeechSynthesisUtterance(e);t.lang=this.#t.lang,t.voice=this.#t.voice,this.#e.speak(t),t.onend=()=>{i()},n&&(n.cancel=()=>{i()})}else r()}))}},r={4:14,9:31,20:38,28:84,40:59,51:67,63:81,71:91},a={17:7,54:34,62:19,64:60,87:24,93:73,95:75,99:78},o=async function(){if(t.loading||(t.loading=!0),t.currentPlayer.overHundred){const e=`${t.currentPlayer.name}, You've to land on exact position of 100. Please try again in a next turn.`;await m(e);try{await i.speak(e),t.currentPlayer.finalStatus()}catch{setTimeout((()=>t.currentPlayer.finalStatus()),3e3)}return}if(t.currentPlayer.gameOver){const e=`${t.currentPlayer.name}, You landed on destination of your dreem! \n            Very very congratulations to you! You won the Game! \n            It's party time.`;if(!t.winSounds.winSound&&!t.winSounds.cheersSound){const e=d("media/win.mp3"),n=d("media/cheers.mp3");e.volume=.25,n.volume=.25,t.winSounds.winSound=e,t.winSounds.cheersSound=n}return await m(e),await Promise.allSettled([i.speak(e),l(t.winSounds.winSound,1),l(t.winSounds.cheersSound,1)]),void t.currentPlayer.finalStatus()}if(t.currentPlayer.ladder.position){const e=`${t.currentPlayer.name}, You reached at the position ${t.currentPlayer.currentPosition}. Great! You are going to climb a ladder!`;if(!t.ladderSounds.ladderSound){const e=d("media/ladder.mp3");e.volume=.15,t.ladderSounds.ladderSound=e}return await m(e),await Promise.allSettled([i.speak(e),l(t.ladderSounds.ladderSound,1)]),t.currentPlayer.ladder.position=0,void t.currentPlayer.movePiece()}if(t.currentPlayer.snake.position){const e=`${t.currentPlayer.name}, You reached at the position ${t.currentPlayer.currentPosition}. Oh no, You got a snake byte. You have to descend down.`;if(!t.snakeSounds.snakeSound){const e=d("media/snake.mp3");e.volume=1,t.snakeSounds.snakeSound=e}return await m(e),await Promise.allSettled([i.speak(e),l(t.snakeSounds.snakeSound,3)]),t.currentPlayer.snake.position=0,void t.currentPlayer.movePiece()}const e=`${t.currentPlayer.name}, You got ${t.currentPlayer.currentValue}.`;await m(e);try{await i.speak(e),t.currentPlayer.movePiece()}catch{setTimeout((()=>t.currentPlayer.movePiece()),3e3)}},s=new class{constructor(){}async roleDice(){t.loading||(t.loading=!0);const e="Rolling Dice...";if(t.currentPlayer.currentValue=Math.floor(6*Math.random())+1,await m(e),t.rollingDiceSound)await Promise.allSettled([l(t.rollingDiceSound,1),i.speak(e)]),o();else{const n=d("media/dice_rolling.mp3");n.volume=1,t.rollingDiceSound=n,await Promise.allSettled([l(t.rollingDiceSound,1),i.speak(e)]),o()}}},u=class{constructor(e){this.ownSound=e,this.name="",this.currentPosition=1,this.currentValue=0,this.overHundred=!1,this.gameOver=!1,this.ladder=!1,this.snake=!1}#r(e){return new Promise((async(n,r)=>{if(this.ladder.position)await m(e),await Promise.allSettled([c(),i.speak(e)]),this.currentValue=0,o(),this.currentPosition=this.ladder.position,n();else{if(!t.ladderSounds.movingPieceSound){const e=d("media/piece_move_up.mp3");e.volume=1,t.ladderSounds.movingPieceSound=e}await m(e),await Promise.allSettled([i.speak(e),l(t.ladderSounds.movingPieceSound,1)]),this.finalStatus(),this.ladder=!1,n()}}))}#a(e){return new Promise((async(n,r)=>{if(this.snake.position)await m(e),await Promise.allSettled([i.speak(e),c()]),this.currentValue=0,o(),this.currentPosition=this.snake.position,n();else{if(!t.snakeSounds.movingPieceSound){const e=d("media/piece_move_down.mp3");e.volume=1,t.snakeSounds.movingPieceSound=e}await m(e),await Promise.allSettled([i.speak(e),l(t.snakeSounds.movingPieceSound,1)]),this.finalStatus(),this.snake=!1,n()}}))}#o(e){return new Promise((async(n,r)=>{if(this.overHundred){if(!t.overHundredSounds.stumbledSound&&!t.overHundredSounds.moveDownSound){const e=d("media/over_hundred.mp3"),n=d("media/move_down.ogg");e.volume=1,n.volume=1,t.overHundredSounds.stumbledSound=e,t.overHundredSounds.moveDownSound=n}await m(e),await Promise.allSettled([i.speak(e),await c(),await l(t.overHundredSounds.stumbledSound,1),l(t.overHundredSounds.moveDownSound,1)]),this.currentValue=0,o(),n()}}))}#s(e){return new Promise((async(n,t)=>{this.gameOver&&(await m(e),await Promise.allSettled([c(),i.speak(e)]),this.currentValue=0,o(),n())}))}async renderPlayGround(){"init"===t.mode&&(t.mode="started"),this.ownSound.play(),this.ownSound.loop=!0;const e=`Hi ${this.name}, It's your turn. \n        You are currently at the position ${this.currentPosition}. \n        To role the dice, press the space bar or enter key. \n        To hear these instructions again, press CTRL + J.`;i.speak(e),await m(e,{inputId:"role-dice",inputLabel:"Role Dice"}),s.roleDice()}async movePiece(){t.loading||(t.loading=!0);const e=`${this.name}, moving your piece...`;this.currentPosition+=this.currentValue,await new Promise(((e,n)=>{if(t.currentPlayer.currentPosition>100){const n=t.currentPlayer.currentPosition-t.currentPlayer.currentValue;t.currentPlayer.currentValue=100-n,t.currentPlayer.currentPosition=n,t.currentPlayer.overHundred=!0,e()}100===t.currentPlayer.currentPosition&&(t.currentPlayer.gameOver=!0,e()),r[t.currentPlayer.currentPosition]&&(t.currentPlayer.ladder={position:r[t.currentPlayer.currentPosition]},e()),a[t.currentPlayer.currentPosition]&&(t.currentPlayer.snake={position:a[t.currentPlayer.currentPosition]},e()),e()})),this.overHundred?await this.#o(e):this.gameOver?await this.#s(e):this.ladder?await this.#r(e):this.snake?await this.#a(e):(await m(e),await Promise.allSettled([i.speak(e),c()]),this.finalStatus())}async finalStatus(){t.loading&&(t.loading=!1);let e="";const n={inputId:"continue",inputLabel:"Continue"};if(this.overHundred)e=`${this.name}, You are still at the position ${this.currentPosition}. \n            To continue, press the space bar or enter key. \n            To hear these instructions again, press CTRL + J.`,this.overHundred=!1;else{if(this.gameOver)return n.inputId="finish-game",n.inputLabel="Finish Game",e="Game Status. \n            To finish the game, press the space bar or enter key. \n            To hear these instructions again, press CTRL + J.",i.speak(e),await m(e,n),void this.finishGame();e=`${this.name}, You've reached at the position ${this.currentPosition}. \n            To continue, press the space bar or enter key. \n            To hear these instructions again, press CTRL + J.`}if(t.index===t.players.length-1)return i.speak(e),await m(e,n),t.index=0,this.ownSound.pause(),this.ownSound.currentTime=0,t.currentPlayer=t.players[0],void t.currentPlayer.renderPlayGround();i.speak(e),await m(e,n),this.ownSound.pause(),this.ownSound.currentTime=0,t.currentPlayer=t.players[++t.index],t.currentPlayer.renderPlayGround()}finishGame(){console.log("Game finished!")}},d=function(e){const n=new Audio(e);return n.volume=.05,n},l=function(e,n){return new Promise(((t,i)=>{e.play(),e.onended=()=>{--n?e.play():t()}}))},c=async function(){return new Promise((async(e,n)=>{if(t.movingPieceSound)await l(t.movingPieceSound,t.currentPlayer.currentValue),e();else{const n=d("media/step.mp3");n.volume=1,t.movingPieceSound=n,await l(t.movingPieceSound,t.currentPlayer.currentValue),e()}}))},m=function(e,r){return r=r||!1,new Promise((async(a,o)=>{let s="";if("init"===t.mode){const o=`<form id="${r.formId}">\n            <label for="${r.inputId}">${r.inputLabel}</label>\n            <input id="${r.inputId}" type="${r.inputType}" aria-describedby="${r.inputId}-instructions"\n                ${"number"===r.inputType?'min="1" max="4"':""}>\n            <p id="${r.inputId}-instructions">${e}</p>\n            <button type="submit" hidden>Next</button>\n            </form>`;n.innerHTML=o,s=document.getElementById(r.inputId),document.getElementById(r.formId).addEventListener("submit",(e=>{e.preventDefault(),function(e,n){if("numberOfPlayers"!==e.inputId||t.players.length)t.players[t.index].name=n||`Player ${t.index+1}`;else{let e=0;for(;e<n;e++){let n=d(`media/player_${e+1}.mp3`);t.players.push(new u(n))}}}(r,s.value),a()})),s.addEventListener("input",(e=>{i.speak(e.target.value)}))}if("started"===t.mode&&!t.loading){const t=`<p id="instructions">${e}</p>\n            <button id="${r.inputId}" aria-describedby="instructions">${r.inputLabel}</button>`;n.innerHTML=t,s=document.getElementById(r.inputId),s.onclick=()=>a()}if("started"===t.mode&&t.loading){const t=`<div id="instructions" tabindex="0">${e}</div>`;n.innerHTML=t,s=document.getElementById("instructions"),a()}s&&(s.focus(),s.addEventListener("keydown",(async n=>{if(n.ctrlKey&&"j"===n.key&&(n.preventDefault(),i.speak(e)),n.ctrlKey&&"s"===n.key){let r={};n.preventDefault(),t.speech?(r.cancel&&r.cancel(),i.speak("Speech Off"),t.speech=!1):(t.speech=!0,await i.speak(`Speech On. ${e}`,r))}})))}))},p=new class{constructor(){}firstScreenWidgit(){n.innerHTML='<form id="start-game" action="#">\n            <h1>Snakes and Ladders</h1>\n            <button id="start">Start Game</button>\n        </form>',document.getElementById("start").focus(),document.getElementById("start-game").addEventListener("submit",(e=>{e.preventDefault(),this.welcomeAnimation()}))}async welcomeAnimation(){const e=await new Promise(((e,n)=>{const t=new Audio("media/intro.mp3");t.preload="metadata",t.addEventListener("loadedmetadata",(()=>{t.volume=.05,e(t)}))})),t=document.createElement("p");t.textContent="Welcome",t.classList.add("welcome"),n.replaceChild(t,document.getElementById("start-game")),e.play(),t.style.animation=`welcome ${e.duration}s`,setTimeout((async()=>await i.speak(t.textContent)),1e3*e.duration/4),e.onended=()=>this.fetchNumberOfPlayers()}async fetchNumberOfPlayers(){const e="Enter number of players. \n        Maximum up-to 4 players are allowed. \n        You can also use up or down arrow keys to adjust the value. \n        To hear these instructions again, Press CTRL + J.";t.currentSound?t.currentSound.play():(t.currentSound=d("media/select_players.mp3"),t.currentSound.play(),t.currentSound.loop=!0),i.speak(e),await m(e,{formId:"number-of-players",inputId:"numberOfPlayers",inputType:"number",inputLabel:"Number of Players"}),this.fetchPlayersName()}async fetchPlayersName(){const e=`Enter name of the player number ${t.index+1}. \n        To hear these instructions again, press CTRL +J.`,n={formId:"player-name",inputId:"playerNameInput",inputLabel:`Name of the Player Number ${t.index+1}`,inputType:"text"};if(i.speak(e),t.index===t.players.length-1)return await m(e,n),t.index=0,t.currentSound.pause(),t.currentPlayer=t.players[0],void t.currentPlayer.renderPlayGround();await m(e,n),t.index++,this.fetchPlayersName()}};window.onload=()=>{p.firstScreenWidgit()}})();