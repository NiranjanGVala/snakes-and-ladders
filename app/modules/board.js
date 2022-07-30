import { gameContainer } from "./globals"
import state from "./state"
import { embedTemplate } from "./functions"

const ladders = {
    4: 14,
    9: 31,
    20: 38,
    28: 84,
    40: 59,
    51: 67,
    63: 81,
    71: 91
}

const snakes = {
    17: 7,
    54: 34,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    99: 78
}

export function showCurrentStatus(status) {
    let instructions = ""
    const template = {
        mode: "gameStarted",
        loading: true
    }
    if (status) {
        if (status.ladder) {
            instructions = `${state.currentPlayer.name}, You reached at the position ${state.currentPlayer.currentPosition}. Great! You are going to climb a ladder!`
        }
        if (status.snake) {
            instructions = `${state.currentPlayer.name}, You reached at the position ${state.currentPlayer.currentPosition}. Oh no, You got a snake byte. You have to descend down.`
        }
        if (status.overHundred) {
            instructions = `${state.currentPlayer.name}, You've to land on exact position of 100. Please try again in a next turn.`
            embedTemplate(instructions, template, () => state.currentPlayer.finalStatus(status))
            return
        }
    } else {
        instructions = `${state.currentPlayer.name}, You got ${state.currentPlayer.currentValue}.`
    }
    embedTemplate(instructions, template, () => state.currentPlayer.movePiece())
}

export function checkCurrentPosition(position) {
    if (ladders[position]) {
        return { ladder: ladders[position] }
    }
    if (snakes[position]) {
        return { snake: snakes[position] }
    }
    return false
}