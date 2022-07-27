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

export function showCurrentStatus(player, index, status) {
    index = index || 0
    let instructions = ""
    const template = {
        mode: "gameStarted",
        loading: true
    }
    if (status) {
        if (status.ladder) {
            instructions = `${player.name}, You reached at the position ${player.currentPosition}. Great! You are going to climb a ladder!`
        }
        if (status.snake) {
            instructions = `${player.name}, You reached at the position ${player.currentPosition}. Oh no, You got a snake byte. You have to descend down.`
        }
        if (status.overHundred) {
            instructions = `${player.name}, You've to land on exact position of 100. Please try again in a next turn.`
            embedTemplate(instructions, template, () => player.finalStatus(index, status))
            return
        }
    } else {
        instructions = `${player.name}, You got ${player.currentValue}.`
    }
    embedTemplate(instructions, template, () => player.movePiece(index))
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