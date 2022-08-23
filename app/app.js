// Media file imports
import introSound from "./media/intro.mp3"
import selectPlayersSound from "./media/select_players.mp3"
import playerOneSound from "./media/player_1.mp3"
import playerTwoSound from "./media/player_2.mp3"
import playerThreeSound from "./media/player_3.mp3"
import playerFourSound from "./media/player_4.mp3"
import diceSound from "./media/dice_rolling.mp3"
import stepSound from "./media/step.mp3"
import ladderSound from "./media/ladder.mp3"
import snakeSound from "./media/snake.mp3"
import pieceMoveUpSound from "./media/piece_move_up.mp3"
import pieceMoveDownSound from "./media/piece_move_down.mp3"
import overHundredSound from "./media/over_hundred.mp3"
import cheersSound from "./media/cheers.mp3"
import winSound from "./media/win.mp3"

// CSS import
import "./css/style.css"

// Module import
import init from "./modules/init"
window.onload = () => {
    init.firstScreenWidgit()
}

if (module.hot) {
    module.hot.accept()
}