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

const showCurrentStatus = async function (status) {
    const config = {
        mode: "gameStarted",
        loading: true
    }
    if (status) {
        if (status.ladder) {
            const instructions = `${state.currentPlayer.name}, You reached at the position ${state.currentPlayer.currentPosition}. Great! You are going to climb a ladder!`
            if (!state.ladderSounds.ladderSound) {
                const audio = loadAudioFile("/media/ladder.mp3")
                audio.volume = 0.15
                state.ladderSounds.ladderSound = audio
            }
            await embedTemplate(instructions, config)
            await Promise.all([
                speechSynth.speak(instructions),
                playAudio(state.ladderSounds.ladderSound, 1)
            ])
            state.currentPlayer.afterLadder = true
        }
        if (status.snake) {
            const instructions = `${state.currentPlayer.name}, You reached at the position ${state.currentPlayer.currentPosition}. Oh no, You got a snake byte. You have to descend down.`
            if (!state.snakeSounds.snakeSound) {
                const audio = loadAudioFile("/media/snake.mp3")
                audio.volume = 1
                state.snakeSounds.snakeSound = audio
            }
            await embedTemplate(instructions, config)
            await Promise.all([
                speechSynth.speak(instructions),
                playAudio(state.snakeSounds.snakeSound, 3)
            ])
            state.currentPlayer.afterSnake = true
        }
        if (status.overHundred) {
            const instructions = `${state.currentPlayer.name}, You've to land on exact position of 100. Please try again in a next turn.`
            await embedTemplate(instructions, config)
            await speechSynth.speak(instructions)
            state.currentPlayer.finalStatus(status)
            return
        }
        if (status.gameOver) {
            const instructions = `${state.currentPlayer.name}, You landed on destination of your dreem! 
            Very very congratulations to you! You won the Game! 
            It's party time.`
            if (!state.winSounds.winSound && !state.winSounds.cheersSound) {
                const winSound = loadAudioFile("/media/win.mp3")
                const cheersSound = loadAudioFile("/media/cheers.mp3")
                winSound.volume = 0.25
                cheersSound.volume = 0.25
                state.winSounds.winSound = winSound
                state.winSounds.cheersSound = cheersSound
            }
            await embedTemplate(instructions, config)
            await Promise.all([
                speechSynth.speak(instructions),
                playAudio(state.winSounds.winSound, 1),
                playAudio(state.winSounds.cheersSound, 1)
            ])
            state.currentPlayer.finalStatus(status)
            return
        }
    } else {
        const instructions = `${state.currentPlayer.name}, You got ${state.currentPlayer.currentValue}.`
        await embedTemplate(instructions, config)
        await speechSynth.speak(instructions)
    }
    state.currentPlayer.movePiece()
}

const checkCurrentPosition = function (position) {
    if (ladders[position]) {
        return { ladder: ladders[position] }
    }
    if (snakes[position]) {
        return { snake: snakes[position] }
    }
    return false
}

export { showCurrentStatus, checkCurrentPosition }