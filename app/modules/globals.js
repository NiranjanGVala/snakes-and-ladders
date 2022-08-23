import state from "./state"

// Select global elements
export const gameContainer = document.getElementById("game-container")

// Global configs
export const introSoundConfig = {
    file: "media/intro.mp3",
    volume: 0.05
}
export const currentSoundConfig = {
    file: "media/select_players.mp3",
    loop: true
}
export const playerOneSoundConfig = {
    file: "media/player_1.mp3",
    loop: true
}
export const playerTwoSoundConfig = {
    file: "media/player_2.mp3",
    loop: true
}
export const playerThreeSoundConfig = {
    file: "media/player_3.mp3",
    loop: true
}
export const playerFourSoundConfig = {
    file: "media/player_4.mp3",
    loop: true
}
export const rollingDiceSoundConfig = {
    file: "media/dice_rolling.mp3",
    volume: 1
}
export const movingPieceSoundConfig = {
    file: "media/step.mp3",
    volume: 1
}
export const ladderSoundConfig = {
    file: "media/ladder.mp3",
    volume: 0.15
}
export const snakeSoundConfig = {
    file: "media/snake.mp3",
    volume: 1
}
export const ladderClimbSoundConfig = {
    file: "media/piece_move_up.mp3",
    volume: 1
}
export const snakeDescendDownSoundConfig = {
    file: "media/piece_move_down.mp3",
    volume: 1
}
export const overHundredSoundConfig = {
    file: "media/over_hundred.mp3",
    volume: 1
}
export const winSoundConfig = {
    file: "media/win.mp3",
    volume: 0.25
}
export const cheersSoundConfig = {
    file: "media/cheers.mp3",
    volume: 0.25
}