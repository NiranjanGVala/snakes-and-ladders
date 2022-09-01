import { gameContainer } from "./globals"
import state from "./state"
import { embedTemplate, loadAudioFile, playAudio } from "./functions"
import speechSynth from "./speech-synth"

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

const showCurrentStatus = async function () {
    if (!state.loading) state.loading = true
    if (state.currentPlayer.overHundred) {
        const instructions = `${state.currentPlayer.name}, You've to land on exact position of 100. Please try again in a next turn.`
        await embedTemplate(instructions)
        try {
            await speechSynth.speak(instructions)
            state.currentPlayer.finalStatus()
        } catch {
            setTimeout(() => state.currentPlayer.finalStatus(), 3000)
        }
        return
    }
    if (state.currentPlayer.gameOver) {
        const instructions = `${state.currentPlayer.name}, You landed on destination of your dreem! 
            Very very congratulations to you! You won the Game! 
            It's party time.`
        await embedTemplate(instructions)
        await Promise.allSettled([
            speechSynth.speak(instructions),
            await playAudio(state.winSounds.winSound, 1),
            playAudio(state.winSounds.cheersSound, 1)
        ])
        state.currentPlayer.finalStatus()
        return
    }
    if (state.currentPlayer.ladder.position) {
        const instructions = `${state.currentPlayer.name}, You reached at the position ${state.currentPlayer.currentPosition}. Great! You are going to climb a ladder!`
        await embedTemplate(instructions)
        await Promise.allSettled([
            speechSynth.speak(instructions),
            playAudio(state.ladderSounds.ladderSound, 1)
        ])
        state.currentPlayer.ladder.position = 0
        state.currentPlayer.movePiece()
        return
    }
    if (state.currentPlayer.snake.position) {
        const instructions = `${state.currentPlayer.name}, You reached at the position ${state.currentPlayer.currentPosition}. Oh no, You got a snake byte. You have to descend down.`
        await embedTemplate(instructions)
        await Promise.allSettled([
            speechSynth.speak(instructions),
            playAudio(state.snakeSounds.snakeSound, 3)
        ])
        state.currentPlayer.snake.position = 0
        state.currentPlayer.movePiece()
        return
    }
    const instructions = `${state.currentPlayer.name}, You got ${state.currentPlayer.currentValue}.`
    await embedTemplate(instructions)
    try {
        await speechSynth.speak(instructions)
        state.currentPlayer.movePiece()
    } catch {
        setTimeout(() => state.currentPlayer.movePiece(), 3000)
    }
}

const checkCurrentPosition = function () {
    return new Promise((resolve, reject) => {
        if (state.currentPlayer.currentValue === 6) {
            state.currentPlayer.turn = true
        }
        if (state.currentPlayer.currentPosition > 100) {
            const oldPosition = state.currentPlayer.currentPosition - state.currentPlayer.currentValue
            state.currentPlayer.currentValue = 100 - oldPosition
            state.currentPlayer.currentPosition = oldPosition
            state.currentPlayer.overHundred = true
            resolve()
        }
        if (state.currentPlayer.currentPosition === 100) {
            state.currentPlayer.gameOver = true
            resolve()
        }
        if (ladders[state.currentPlayer.currentPosition]) {
            state.currentPlayer.ladder = {
                position: ladders[state.currentPlayer.currentPosition]
            }
            resolve()
        }
        if (snakes[state.currentPlayer.currentPosition]) {
            state.currentPlayer.snake = {
                position: snakes[state.currentPlayer.currentPosition]
            }
            resolve()
        }
        resolve()
    })
}

export { showCurrentStatus, checkCurrentPosition }