import { embedTemplate, gameMusic } from "./functions"
import { showCurrentStatus } from "./board"
import { gameContainer } from "./globals"
import state from "./state"

class Dice {
    constructor() {
        // Will be doing something very soon.
    }

    roleDice() {
        const instructions = `Rolling Dice...`
        const template = {
            mode: "gameStarted",
            loading: true
        }
        state.currentPlayer.currentValue = Math.floor(Math.random() * 6) + 1
        embedTemplate(instructions, template, () => {
            const audio = gameMusic("/media/dice_rolling.mp3")
            audio.volume = 1
            audio.play()
            audio.addEventListener("ended", () => showCurrentStatus())
        })
    }
}

export default new Dice()