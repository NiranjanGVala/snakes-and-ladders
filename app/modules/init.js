import {
    gameContainer,
    introSoundConfig,
    currentSoundConfig,
    playerOneSoundConfig,
    playerTwoSoundConfig,
    playerThreeSoundConfig,
    playerFourSoundConfig,
    rollingDiceSoundConfig,
    movingPieceSoundConfig,
    ladderSoundConfig,
    snakeSoundConfig,
    ladderClimbSoundConfig,
    snakeDescendDownSoundConfig,
    overHundredSoundConfig,
    winSoundConfig,
    cheersSoundConfig
} from "./globals"
import state from "./state"
import { embedTemplate, loadAudioFile } from "./functions"
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
                this.init()
            })
    }

    init() {
        if (!state.loading) state.loading = true
        const instructions = "Please Wait..."
        return new Promise(async (resolve, reject) => {
            embedTemplate(instructions)
            speechSynth.speak(instructions)
            const introSound = await loadAudioFile(introSoundConfig)
            state.introSound = introSound
            const currentSound = await loadAudioFile(currentSoundConfig)
            state.currentSound = currentSound
            const playerOneSound = await loadAudioFile(playerOneSoundConfig)
            state.playersSound.push(playerOneSound)
            const playerTwoSound = await loadAudioFile(playerTwoSoundConfig)
            state.playersSound.push(playerTwoSound)
            const playerThreeSound = await loadAudioFile(playerThreeSoundConfig)
            state.playersSound.push(playerThreeSound)
            const playerFourSound = await loadAudioFile(playerFourSoundConfig)
            state.playersSound.push(playerFourSound)
            const rollingDiceSound = await loadAudioFile(rollingDiceSoundConfig)
            state.rollingDiceSound = rollingDiceSound
            const movingPieceSound = await loadAudioFile(movingPieceSoundConfig)
            state.movingPieceSound = movingPieceSound
            const ladderSound = await loadAudioFile(ladderSoundConfig)
            state.ladderSounds.ladderSound = ladderSound
            const snakeSound = await loadAudioFile(snakeSoundConfig)
            state.snakeSounds.snakeSound = snakeSound
            const ladderClimbSound = await loadAudioFile(ladderClimbSoundConfig)
            state.ladderSounds.movingPieceSound = ladderClimbSound
            const snakeDescendDownSound = await loadAudioFile(snakeDescendDownSoundConfig)
            state.snakeSounds.movingPieceSound = snakeDescendDownSound
            const overHundredSound = await loadAudioFile(overHundredSoundConfig)
            state.overHundredSound = overHundredSound
            const winSound = await loadAudioFile(winSoundConfig)
            state.winSounds.winSound = winSound
            const cheersSound = await loadAudioFile(cheersSoundConfig)
            state.winSounds.cheersSound = cheersSound
            this.welcomeAnimation()
            resolve()
        })
    }

    async welcomeAnimation() {
        if (state.loading) state.loading = false
        const welcomeText = document.createElement("p")
        welcomeText.textContent = "Welcome"
        welcomeText.classList.add("welcome")
        gameContainer.replaceChild(welcomeText, document.getElementById("instructions"))
        state.introSound.play()
        welcomeText.style.animation = `welcome ${state.introSound.duration}s`
        setTimeout(async () => await speechSynth.speak(welcomeText.textContent), (state.introSound.duration * 1000) / 4)
        state.introSound.onended = () => this.fetchNumberOfPlayers()
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
        state.currentSound.play()
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
        // 2.1. Improve the responsibility of this function.
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