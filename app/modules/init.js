import globalVars from "./globals"
import { embedTemplate, introMusic, gameMusic } from "./functions"
import speechSynth from "./speech-synth"
let currentSound = globalVars.state.currentSound

class Init {
    constructor() {
        // Will do something shortly
    }

    firstScreenWidgit() {
        const template = `<form id="start-game" action="#">
            <h1>Snakes and Ladders</h1>
            <button id="start">Start Game</button>
        </form>`
        globalVars.gameContainer.innerHTML = template
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
        globalVars.gameContainer.replaceChild(welcomeText, document.getElementById("start-game"))
        intro.play()
        welcomeText.style.animation = `welcome ${intro.duration}s`
        setTimeout(async () => await speechSynth.speak(welcomeText.textContent), (intro.duration * 1000) / 4)
        intro.addEventListener("ended", () => this.fetchNumberOfPlayers())
    }

    fetchNumberOfPlayers() {
        const instructions = `Enter number of players. 
        Maximum up-to 4 players are allowed. 
        You can also use up or down arrow keys to adjust the value.`
        currentSound = gameMusic("/media/select_players.mp3")
        currentSound.play()
        currentSound.loop = true
        embedTemplate(instructions, {
            mode: "init",
            formId: "number-of-players",
            inputId: "numberOfPlayers",
            inputType: "number",
            inputLabel: "Number of Players"
        }, () => {
            this.fetchPlayersName()
        })
    }

    fetchPlayersName(index) {
        index = index || 0
        const instructions = `Enter name of the player number ${index + 1}.`
        const template = {
            mode: "init",
            player: index,
            formId: "player-name",
            inputId: "playerNameInput",
            inputLabel: `Name of the Player Number ${index + 1}`,
            inputType: "text"
        }
        if (index === globalVars.state.players.length - 1) {
            embedTemplate(instructions, template, () => {
                currentSound.pause()
                globalVars.state.players[0].renderPlayGround()
            })
            return
        }
        embedTemplate(instructions, template, () => this.fetchPlayersName(index + 1))
    }
}

export default new Init()