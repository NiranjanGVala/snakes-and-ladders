import { checkCurrentPosition, showCurrentStatus } from "./board"
import dice from "./dice"
import { embedTemplate, loadAudioFile, movingPieceSound, playAudio } from "./functions"
import speechSynth from "./speech-synth"
import state from "./state"

class Player {
    constructor(ownSound) {
        this.ownSound = ownSound
        this.name = ""
        this.currentPosition = 1
        this.currentValue = 0
        this.overHundred = false
        this.gameOver = false
        this.ladder = false
        this.snake = false
    }

    // Private methods
    #handleLadder(instructions) {
        return new Promise(async (resolve, reject) => {
            if (this.ladder.position) {
                await embedTemplate(instructions)
                await Promise.all([
                    movingPieceSound(),
                    speechSynth.speak(instructions)
                ])
                this.currentValue = 0
                showCurrentStatus()
                this.currentPosition = this.ladder.position
                resolve()
            } else {
                if (!state.ladderSounds.movingPieceSound) {
                    const audio = loadAudioFile("/media/piece_move_up.mp3")
                    audio.volume = 1
                    state.ladderSounds.movingPieceSound = audio
                }
                await embedTemplate(instructions)
                await Promise.all([
                    speechSynth.speak(instructions),
                    playAudio(state.ladderSounds.movingPieceSound, 1)
                ])
                this.finalStatus()
                this.ladder = false
                resolve()
            }
        })
    }

    #handleSnake(instructions) {
        return new Promise(async (resolve, reject) => {
            if (this.snake.position) {
                await embedTemplate(instructions)
                await Promise.all([
                    speechSynth.speak(instructions),
                    movingPieceSound()
                ])
                this.currentValue = 0
                showCurrentStatus()
                this.currentPosition = this.snake.position
                resolve()
            } else {
                if (!state.snakeSounds.movingPieceSound) {
                    const audio = loadAudioFile("/media/piece_move_down.mp3")
                    audio.volume = 1
                    state.snakeSounds.movingPieceSound = audio
                }
                await embedTemplate(instructions)
                await Promise.all([
                    speechSynth.speak(instructions),
                    playAudio(state.snakeSounds.movingPieceSound, 1)
                ])
                this.finalStatus()
                this.snake = false
                resolve()
            }
        })
    }

    #handleOverHundred(instructions) {
        return new Promise(async (resolve, reject) => {
            if (this.overHundred) {
                if (!state.overHundredSounds.stumbledSound && !state.overHundredSounds.moveDownSound) {
                    const stumbledAudio = loadAudioFile("/media/over_hundred.mp3")
                    const moveDownAudio = loadAudioFile("/media/move_down.ogg")
                    stumbledAudio.volume = 1
                    moveDownAudio.volume = 1
                    state.overHundredSounds.stumbledSound = stumbledAudio
                    state.overHundredSounds.moveDownSound = moveDownAudio
                }
                await embedTemplate(instructions)
                await Promise.all([
                    speechSynth.speak(instructions),
                    await movingPieceSound(),
                    await playAudio(state.overHundredSounds.stumbledSound, 1),
                    playAudio(state.overHundredSounds.moveDownSound, 1)
                ])
                this.currentValue = 0
                showCurrentStatus()
                resolve()
            }
        })
    }

    #handleGameOver(instructions) {
        return new Promise(async (resolve, reject) => {
            if (this.gameOver) {
                await embedTemplate(instructions)
                await Promise.all([
                    movingPieceSound(),
                    speechSynth.speak(instructions)
                ])
                this.currentValue = 0
                showCurrentStatus()
                resolve()
            }
        })
    }

    // Public methods
    async renderPlayGround() {
        if (state.mode === "init") state.mode = "started"
        this.ownSound.play()
        this.ownSound.loop = true
        const instructions = `Hi ${this.name}, It's your turn. 
        You are currently at the position ${this.currentPosition}. 
        To role the dice, press the space bar or enter key. 
        To hear these instructions again, press CTRL + J.`
        const config = {
            inputId: "role-dice",
            inputLabel: "Role Dice"
        }
        speechSynth.speak(instructions)
        await embedTemplate(instructions, config)
        dice.roleDice()
    }

    async movePiece() {
        if (!state.loading) state.loading = true
        const instructions = `${this.name}, moving your piece...`
        this.currentPosition += this.currentValue
        await checkCurrentPosition()
        if (this.overHundred) {
            await this.#handleOverHundred(instructions)
            return
        }
        if (this.gameOver) {
            await this.#handleGameOver(instructions)
            return
        }
        if (this.ladder) {
            await this.#handleLadder(instructions)
            return
        }
        if (this.snake) {
            await this.#handleSnake(instructions)
            return
        }
        await embedTemplate(instructions)
        await Promise.all([
            speechSynth.speak(instructions),
            movingPieceSound()
        ])
        this.finalStatus()
    }

    async finalStatus() {
        if (state.loading) state.loading = false
        let instructions = ""
        const config = {
            inputId: "continue",
            inputLabel: "Continue"
        }
        if (this.overHundred) {
            instructions = `${this.name}, You are still at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`
            this.overHundred = false
        } else if (this.gameOver) {
            config.inputId = "finish-game"
            config.inputLabel = "Finish Game"
            instructions = `Game Status. 
            To finish the game, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`
            speechSynth.speak(instructions)
            await embedTemplate(instructions, config)
            this.finishGame()
            return
        } else {
            instructions = `${this.name}, You've reached at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`
        }
        if (state.index === state.players.length - 1) {
            speechSynth.speak(instructions)
            await embedTemplate(instructions, config)
            state.index = 0
            this.ownSound.pause()
            this.ownSound.currentTime = 0
            state.currentPlayer = state.players[0]
            state.currentPlayer.renderPlayGround()
            return
        }
        speechSynth.speak(instructions)
        await embedTemplate(instructions, config)
        this.ownSound.pause()
        this.ownSound.currentTime = 0
        state.currentPlayer = state.players[++state.index]
        state.currentPlayer.renderPlayGround()
    }

    finishGame() {
        console.log("Game finished!")
    }
}

export default Player