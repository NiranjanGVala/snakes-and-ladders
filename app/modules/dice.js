import { gameContainer } from "./globals"
import { embedTemplate, loadAudioFile, playAudio } from "./functions"
import { showCurrentStatus } from "./board"
import state from "./state"
import speechSynth from "./speech-synth"

class Dice {
    constructor() {
        // Will be doing something very soon.
    }

    async roleDice() {
        const instructions = `Rolling Dice...`
        const config = {
            mode: "gameStarted",
            loading: true
        }
        // state.currentPlayer.currentValue = Math.floor(Math.random() * 6) + 1
        state.currentPlayer.currentValue = 3
        await embedTemplate(instructions, config)
        if (!state.rollingDiceSound) {
            const audio = loadAudioFile("/media/dice_rolling.mp3")
            audio.volume = 1
            state.rollingDiceSound = audio
            await Promise.all([
                playAudio(state.rollingDiceSound, 1),
                speechSynth.speak(instructions)
            ])
            showCurrentStatus()
        } else {
            await Promise.all([
                playAudio(state.rollingDiceSound, 1),
                speechSynth.speak(instructions)
            ])
            showCurrentStatus()
        }
    }
}

export default new Dice()