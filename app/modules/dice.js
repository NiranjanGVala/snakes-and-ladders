import { embedTemplate, gameMusic } from "./functions"
import { showCurrentStatus } from "./board"

class Dice {
    constructor() {
        // Will be doing something very soon.
    }

    roleDice(player, index) {
        const instructions = `Rolling Dice...`
        const template = {
            mode: "gameStarted",
            loading: true
        }
        player.currentValue = Math.floor(Math.random() * 6) + 1
        embedTemplate(instructions, template, () => {
            const audio = gameMusic("/media/dice_rolling.mp3")
            audio.volume = 1
            audio.play()
            audio.addEventListener("ended", () => showCurrentStatus(player, index))
        })
    }
}

export default new Dice()