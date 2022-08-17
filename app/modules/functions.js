import { gameContainer } from "./globals"
import state from "./state"
import speechSynth from "./speech-synth"
import Player from "./player"

function savePlayersIntoState(config, value) {
    if (config.inputId === "numberOfPlayers" && !state.players.length) {
        let i = 0
        for (i; i < value; i++) {
            let ownSound = loadAudioFile(`media/player_${i + 1}.mp3`)
            state.players.push(new Player(ownSound))
        }
    } else {
        state.players[state.index].name = value ? value : `Player ${state.index + 1}`
    }
}

const introMusic = function () {
    return new Promise((resolve, reject) => {
        const intro = new Audio("media/intro.mp3")
        intro.preload = "metadata"
        intro.addEventListener("loadedmetadata", () => {
            intro.volume = 0.05
            resolve(intro)
        })
    })
}

const loadAudioFile = function (file) {
    const audio = new Audio(file)
    audio.volume = 0.05
    return audio
}

const playAudio = function (audio, count) {
    return new Promise((resolve, reject) => {
        audio.play()
        audio.onended = () => {
            count--
            if (count) {
                audio.play()
            } else {
                resolve()
            }
        }
    })
}

const movingPieceSound = async function () {
    return new Promise(async (resolve, reject) => {
        if (!state.movingPieceSound) {
            const audio = loadAudioFile("media/step.mp3")
            audio.volume = 1
            state.movingPieceSound = audio
            await playAudio(state.movingPieceSound, state.currentPlayer.currentValue)
            resolve()
        } else {
            await playAudio(state.movingPieceSound, state.currentPlayer.currentValue)
            resolve()
        }
    })
}

const embedTemplate = function (instructions, config) {
    config = config || false
    return new Promise(async (resolve, reject) => {
        let userInput = ""
        if (state.mode === "init") {
            const generatedTemplate = `<form id="${config.formId}">
            <label for="${config.inputId}">${config.inputLabel}</label>
            <input id="${config.inputId}" type="${config.inputType}" aria-describedby="${config.inputId}-instructions"
                ${config.inputType === "number" ? `min="1" max="4"` : ""}>
            <p id="${config.inputId}-instructions">${instructions}</p>
            <button type="submit" hidden>Next</button>
            </form>`
            gameContainer.innerHTML = generatedTemplate
            userInput = document.getElementById(config.inputId)
            document.getElementById(config.formId)
                .addEventListener("submit", (e) => {
                    e.preventDefault()
                    savePlayersIntoState(config, userInput.value)
                    resolve()
                })
            userInput.addEventListener("input", (e) => {
                speechSynth.speak(e.target.value)
            })
        }
        if (state.mode === "started" && !state.loading) {
            const generatedTemplate = `<p id="instructions">${instructions}</p>
            <button id="${config.inputId}" aria-describedby="instructions">${config.inputLabel}</button>`
            gameContainer.innerHTML = generatedTemplate
            userInput = document.getElementById(config.inputId)
            userInput.onclick = () => resolve()
        }
        if (state.mode === "started" && state.loading) {
            const generatedTemplate = `<div id="instructions" tabindex="0">${instructions}</div>`
            gameContainer.innerHTML = generatedTemplate
            userInput = document.getElementById("instructions")
            resolve()
        }
        if (userInput) {
            userInput.focus()
            userInput.addEventListener("keydown", async (e) => {
                if (e.ctrlKey && e.key === "j") {
                    e.preventDefault()
                    speechSynth.speak(instructions)
                }
                if (e.ctrlKey && e.key === "s") {
                    let force = {}
                    e.preventDefault()
                    if (state.speech) {
                        if (force.cancel) force.cancel()
                        speechSynth.speak("Speech Off")
                        state.speech = false
                    } else {
                        state.speech = true
                        await speechSynth.speak(`Speech On. ${instructions}`, force)
                    }
                }
            })
        }
    })
}

export { introMusic, embedTemplate, loadAudioFile, playAudio, movingPieceSound }