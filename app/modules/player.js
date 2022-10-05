import { checkCurrentPosition, showCurrentStatus } from "./board"
import dice from "./dice"
import { generateInstructions, embedTemplate, loadAudioFile, movingPieceSound, playAudio } from "./functions"
import speechSynth from "./speech-synth"
import state from "./state"

class Player {
    constructor(ownSound) {
        this.ownSound = ownSound
        this.name = ""
        this.currentPosition = 1
        this.currentValue = 0
        this.turn = false
        this.overHundred = false
        this.gameOver = false
        this.ladder = false
        this.snake = false
        this.ladderCount = 0
        this.snakeCount = 0
        this.turnCount = 0
    }

    // Private methods
    #handleLadder(instructions) {
        return new Promise(async (resolve, reject) => {
            if (this.ladder.position) {
                await embedTemplate(instructions)
                await Promise.allSettled([
                    movingPieceSound(),
                    speechSynth.speak(instructions)
                ])
                this.currentValue = 0
                showCurrentStatus()
                this.currentPosition = this.ladder.position
                this.ladderCount++
                resolve()
            } else {
                await embedTemplate(instructions)
                await Promise.allSettled([
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
                await Promise.allSettled([
                    speechSynth.speak(instructions),
                    movingPieceSound()
                ])
                this.currentValue = 0
                showCurrentStatus()
                this.currentPosition = this.snake.position
                this.snakeCount++
                resolve()
            } else {
                await embedTemplate(instructions)
                await Promise.allSettled([
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
                await embedTemplate(instructions)
                await Promise.allSettled([
                    speechSynth.speak(instructions),
                    await movingPieceSound(),
                    playAudio(state.overHundredSound, 1)
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
                await Promise.allSettled([
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
        let instructions = ""
        let config = ""
        if (this.isComputer) {
            instructions = generateInstructions(`Hi my ${state.players.length > 2 ? 'rivals' : 'rival'}, I'm Felix. It's my turn. 
            I am currently at the position ${this.currentPosition}. 
            I will role my dice after you press the enter or spacebar key. 
            To hear these instructions again, press CTRL + J.`, true)
            config = {
                inputId: "continue",
                inputLabel: "Continue"
            }
        } else {
            instructions = generateInstructions(`Hi ${this.name}, It's your turn. 
            You are currently at the position ${this.currentPosition}. 
            To role the dice, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`, true)
            config = {
                inputId: "role-dice",
                inputLabel: "Role Dice"
            }
        }
        speechSynth.speak(instructions)
        await embedTemplate(instructions, config)
        dice.roleDice()
    }

    async movePiece() {
        if (!state.loading) state.loading = true
        let instructions = ""
        if (this.isComputer) {
            instructions = `I'm moving my piece...`
        } else {
            instructions = `${this.name}, moving your piece...`
        }
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
        await Promise.allSettled([
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
            if (this.isComputer) {
                instructions = `I'm still at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`
            } else {
                instructions = `${this.name}, You are still at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`
            }
            this.overHundred = false
            this.turnCount++
        } else if (this.gameOver) {
            this.turnCount++
            config.inputId = "finish-game"
            config.inputLabel = "Finish Game"
            instructions = generateInstructions(`To finish the game, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`)
            speechSynth.speak(instructions)
            await embedTemplate(instructions, config)
            this.finishGame()
            return
        } else {
            if (this.isComputer) {
                instructions = generateInstructions(`I've reached at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`)
            } else {
                instructions = generateInstructions(`${this.name}, You've reached at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key. 
            To hear these instructions again, press CTRL + J.`)
            }
            this.turnCount++
        }
        if (this.turn) {
            speechSynth.speak(instructions)
            await embedTemplate(instructions, config)
            this.renderPlayGround()
            this.turn = false
        } else {
            if (state.index === state.players.length - 1) {
                speechSynth.speak(instructions)
                await embedTemplate(instructions, config)
                state.rounds++
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
    }

    finishGame() {
        console.log("Game finished!")
    }
}

export default Player