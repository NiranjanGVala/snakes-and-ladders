import globalVars from "./globals"
import { embedTemplate, pieceMovement } from "./functions"
import dice from "./dice"
import { showCurrentStatus, checkCurrentPosition } from "./board"
let currentSound = globalVars.state.currentSound

class Player {
    constructor(ownSound, name, currentPosition, currentValue) {
        this.ownSound = ownSound || false
        this.name = name || ""
        this.currentPosition = currentPosition || 1
        this.currentValue = currentValue || 0
    }

    renderPlayGround(index) {
        this.ownSound.play()
        this.ownSound.loop = true
        index = index || 0
        const instructions = `Hi ${this.name}, It's your turn. 
        You are currently at the position ${this.currentPosition}. 
        To role the dice, press the space bar or enter key.`
        const template = {
            mode: "gameStarted",
            inputId: "role-dice",
            inputLabel: "Role Dice"
        }
        embedTemplate(instructions, template, () => dice.roleDice(this, index))
    }

    movePiece(index) {
        index = index || 0
        const instructions = `${this.name}, moving your piece...`
        const template = {
            mode: "gameStarted",
            loading: true
        }
        if (this.currentPosition + this.currentValue > 100) {
            embedTemplate(instructions, template, () => showCurrentStatus(this, index, { overHundred: true }))
        } else if (this.currentPosition + this.currentValue === 100) {
            embedTemplate(instructions, template, () => this.finalStatus(index, { gameOver: true }))
            return
        } else {
            this.currentPosition += this.currentValue
            pieceMovement(this.currentValue)
        }
        this.currentValue = 0
        const result = checkCurrentPosition(this.currentPosition)
        if (result.ladder) {
            embedTemplate(instructions, template, () => {
                showCurrentStatus(this, index, result)
                this.currentPosition = result.ladder
            })
        }
        if (result.snake) {
            embedTemplate(instructions, template, () => {
                showCurrentStatus(this, index, result)
                this.currentPosition = result.snake
            })
        }
        if (!result) {
            embedTemplate(instructions, template, () => this.finalStatus(index))
        }
    }

    finalStatus(index, status) {
        index = index || 0
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
        if (index === globalVars.state.players.length - 1) {
            embedTemplate(instructions, template, () => {
                this.ownSound.pause()
                this.ownSound.currentTime = 0
                globalVars.state.players[0].renderPlayGround()
            })
            return
        }
        embedTemplate(instructions, template, () => {
            this.ownSound.pause()
            this.ownSound.currentTime = 0
            globalVars.state.players[index + 1].renderPlayGround(index + 1)
        })
    }

    finishGame() {
        console.log("Game finished!")
    }
}

export default Player