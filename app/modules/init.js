import { gameContainer } from "./globals"
import state from "./state"
import { embedTemplate, introMusic, loadAudioFile } from "./functions"
import speechSynth from "./speech-synth"

class Init {
    constructor() {
        // Will do something shortly
    }

    firstScreenWidgit() {
        const template = `<form id="start-game" action="#">
            <h1>Snakes and Ladders</h1>
            <button id="start">Start Game</button>
        </form>`
        gameContainer.innerHTML = template
        document.getElementById("start").focus()
        document.getElementById("start-game")
            .addEventListener("submit", (e) => {
                e.preventDefault()
                this.welcomeAnimation()
            })
    }

    async welcomeAnimation() {
        const intro = await introMusic()
        const welcomeText = document.createElement("p")
        welcomeText.textContent = "Welcome"
        welcomeText.classList.add("welcome")
        gameContainer.replaceChild(welcomeText, document.getElementById("start-game"))
        intro.play()
        welcomeText.style.animation = `welcome ${intro.duration}s`
        setTimeout(async () => await speechSynth.speak(welcomeText.textContent), (intro.duration * 1000) / 4)
        intro.onended = () => this.fetchNumberOfPlayers()
    }

    async fetchNumberOfPlayers() {
        const instructions = `Enter number of players. 
        Maximum up-to 4 players are allowed. 
        You can also use up or down arrow keys to adjust the value. 
        To hear these instructions again, Press CTRL + J.`
        const config = {
            formId: "number-of-players",
            inputId: "numberOfPlayers",
            inputType: "number",
            inputLabel: "Number of Players"
        }
        if (!state.currentSound) {
            state.currentSound = loadAudioFile("/media/select_players.mp3")
            state.currentSound.play()
            state.currentSound.loop = true
        } else {
            state.currentSound.play()
        }
        speechSynth.speak(instructions)
        await embedTemplate(instructions, config)
        this.fetchPlayersName()
    }

    async fetchPlayersName() {
        const instructions = `Enter name of the player number ${state.index + 1}. 
        To hear these instructions again, press CTRL +J.`
        const config = {
            formId: "player-name",
            inputId: "playerNameInput",
            inputLabel: `Name of the Player Number ${state.index + 1}`,
            inputType: "text"
        }
        speechSynth.speak(instructions)
        if (state.index === state.players.length - 1) {
            await embedTemplate(instructions, config)
            state.index = 0
            state.currentSound.pause()
            state.currentPlayer = state.players[0]
            state.currentPlayer.renderPlayGround()
            return
        }
        await embedTemplate(instructions, config)
        state.index++
        this.fetchPlayersName()
    }
}

export default new Init()