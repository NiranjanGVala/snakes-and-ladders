import { gameContainer } from "./globals"
import state from "./state"
import { embedTemplate, pieceMovement } from "./functions"
import dice from "./dice"
import { showCurrentStatus, checkCurrentPosition } from "./board"

class Player {
    constructor(ownSound, name, currentPosition, currentValue) {
        this.ownSound = ownSound || false
        this.name = name || ""
        this.currentPosition = currentPosition || 1
        this.currentValue = currentValue || 0
        this.status = {}
    }

    renderPlayGround() {
        this.ownSound.play()
        this.ownSound.loop = true
        const instructions = `Hi ${this.name}, It's your turn. 
        You are currently at the position ${this.currentPosition}. 
        To role the dice, press the space bar or enter key.`
        const template = {
            mode: "gameStarted",
            inputId: "role-dice",
            inputLabel: "Role Dice"
        }
        embedTemplate(instructions, template, () => dice.roleDice())
    }

    movePiece() {
        const instructions = `${this.name}, moving your piece...`
        const template = {
            mode: "gameStarted",
            loading: true
        }
        if (this.currentPosition + this.currentValue > 100) {
            embedTemplate(instructions, template, () => showCurrentStatus({ overHundred: true }))
        } else if (this.currentPosition + this.currentValue === 100) {
            embedTemplate(instructions, template, () => this.finalStatus({ gameOver: true }))
            return
        } else {
            this.currentPosition += this.currentValue
            pieceMovement(this.currentValue)
        }
        this.currentValue = 0
        const result = checkCurrentPosition(this.currentPosition)
        if (result.ladder) {
            embedTemplate(instructions, template, () => {
                showCurrentStatus(result)
                this.currentPosition = result.ladder
            })
        }
        if (result.snake) {
            embedTemplate(instructions, template, () => {
                showCurrentStatus(result)
                this.currentPosition = result.snake
            })
        }
        if (!result) {
            embedTemplate(instructions, template, () => this.finalStatus())
        }
    }

    finalStatus(status) {
        status = status || false
        let instructions = ""
        const template = {
            mode: "gameStarted",
            inputId: "continue",
            inputLabel: "Continue"
        }
        if (status.overHundred) {
            instructions = `${this.name}, You are still at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key.`
        } else if (status.gameOver) {
            template.inputId = "finish-game"
            template.inputLabel = "Finish Game"
            instructions = `${this.name}, You landed on exact 100! 
            Very very congratulations! You won the Game! 
            It's party time. 
            To finish the game, press the space bar or enter key.`
            embedTemplate(instructions, template, () => this.finishGame())
            return
        } else {
            instructions = `${this.name}, You've reached at the position ${this.currentPosition}. 
            To continue, press the space bar or enter key.`
        }
        if (state.index === state.players.length - 1) {
            embedTemplate(instructions, template, () => {
                state.index = 0
                this.ownSound.pause()
                this.ownSound.currentTime = 0
                state.currentPlayer = state.players[0]
                state.currentPlayer.renderPlayGround()
            })
            return
        }
        embedTemplate(instructions, template, () => {
            this.ownSound.pause()
            this.ownSound.currentTime = 0
            state.currentPlayer = state.players[++state.index]
            state.currentPlayer.renderPlayGround()
        })
    }

    finishGame() {
        console.log("Game finished!")
    }
}

export default Player