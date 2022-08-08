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
        this.ladder = false
        this.snake = false
    }

    // Private methods
    #handleLadder(instructions, config) {
        return new Promise(async (resolve, reject) => {
            if (this.ladder.position) {
                await embedTemplate(instructions, config)
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
                await embedTemplate(instructions, config)
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

    #handleSnake(instructions, config) {
        return new Promise(async (resolve, reject) => {
            if (this.snake.position) {
                await embedTemplate(instructions, config)
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
                await embedTemplate(instructions, config)
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

    // Public methods
    async renderPlayGround() {
        this.ownSound.play()
        this.ownSound.loop = true
        const instructions = `Hi ${this.name}, It's your turn. 
        You are currently at the position ${this.currentPosition}. 
        To role the dice, press the space bar or enter key. 
        To hear these instructions again, press CTRL + J.`
        const config = {
            mode: "gameStarted",
            inputId: "role-dice",
            inputLabel: "Role Dice"
        }
        speechSynth.speak(instructions)
        await embedTemplate(instructions, config)
        dice.roleDice()
    }

    async movePiece() {
        const instructions = `${this.name}, moving your piece...`
        const config = {
            mode: "gameStarted",
            loading: true
        }
        if (this.currentPosition + this.currentValue > 100) {
            this.currentValue = 100 - this.currentPosition
            this.overHundred = true
            if (!state.overHundredSounds.stumbledSound && !state.overHundredSounds.moveDownSound) {
                const stumbledAudio = loadAudioFile("/media/over_hundred.mp3")
                const moveDownAudio = loadAudioFile("/media/move_down.ogg")
                stumbledAudio.volume = 1
                moveDownAudio.volume = 1
                state.overHundredSounds.stumbledSound = stumbledAudio
                state.overHundredSounds.moveDownSound = moveDownAudio
            }
            await embedTemplate(instructions, config)
            await Promise.all([
                speechSynth.speak(instructions),
                await movingPieceSound(),
                await playAudio(state.overHundredSounds.stumbledSound, 1),
                playAudio(state.overHundredSounds.moveDownSound, 1)
            ])
            showCurrentStatus({ overHundred: true })
            this.currentValue = 0
            return
        } else if (this.currentPosition + this.currentValue === 100) {
            await embedTemplate(instructions, config)
            await Promise.all([
                movingPieceSound(),
                speechSynth.speak(instructions)
            ])
            this.currentValue = 0
            showCurrentStatus({ gameOver: true })
            return
        } else {
            if (this.currentValue) this.currentPosition += this.currentValue
        }
        await checkCurrentPosition()
        if (this.ladder) {
            await this.#handleLadder(instructions, config)
            return
        }
        if (this.snake) {
            await this.#handleSnake(instructions, config)
            return
        }
        await embedTemplate(instructions, config)
        await Promise.all([
            speechSynth.speak(instructions),
            movingPieceSound()
        ])
        this.finalStatus()
    }

    async finalStatus(status) {
        status = status || false
        let instructions = ""
        const config = {
            mode: "gameStarted",
            inputId: "continue",
            inputLabel: "Continue"
        }
        if (status.overHundred) {
            instructions = `${this.name}, You are still at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`
        } else if (status.gameOver) {
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