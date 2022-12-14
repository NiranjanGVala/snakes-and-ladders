import { gameContainer } from "./globals"
import state from "./state"
import speechSynth from "./speech-synth"
import Player from "./player"

function savePlayersIntoState(value, config) {
    config = config || false
    if (config.inputId === "numberOfPlayers" && !state.players.length) {
        let i = 0
        for (i; i < value; i++) {
            state.players.push(new Player(state.playersSound[i]))
        }
    } else {
        state.players[state.index].name = value ? value : `Player ${state.index + 1}`
        if (config.isComputer) {
            state.players[state.index].isComputer = true
        } else {
            state.players[state.index].isComputer = false
        }
    }
}

const toggleSpeech = async (e, instructions) => {
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
}

const loadAudioFile = function (config) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(config.file)
        audio.addEventListener("canplaythrough", () => {
            if (config.volume) {
                audio.volume = config.volume
            } else {
                audio.volume = 0.025
            }
            if (config.loop) audio.loop = config.loop
            resolve(audio)
        })
    })
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
        await playAudio(state.movingPieceSound, state.currentPlayer.currentValue)
        resolve()
    })
}

const generateInstructions = function (instructions, processPreInstructions) {
    processPreInstructions = processPreInstructions || false
    let finalInstructions = ""
    if (state.currentPlayer.gameOver) {
        finalInstructions = `<div>
            <h2>Game Stats</h2>
            <p>Total rounds: ${state.rounds}</p>
            <table>
                <thead>
                    <tr><th>Player</th><th>Turns</th><th>Ladders</th><th>Snakes</th></tr>
                </thead>
                <tbody>
                ${state.players.map(player => {
            return `<tr><td>${player.name}</td><td>${player.turnCount}</td><td>${player.ladderCount}</td><td>${player.snakeCount}</td></tr>`
        }).join("")}
                </tbody>
            </table>
            <p>${instructions}</p>
        </div>`
        return finalInstructions
    }
    if (processPreInstructions) {
        const preInstructions = `Round ${state.rounds}:`
        finalInstructions = `<h2>${preInstructions}</h2>
        <p>${instructions}</p>`
    } else {
        finalInstructions = `<p>${instructions}</p>`
    }
    return finalInstructions
}

const embedTemplate = function (instructions, config) {
    config = config || false
    return new Promise(async (resolve, reject) => {
        let userInput = ""
        if (state.mode === "init" && !state.loading) {
            // 2.2. Improve the responsibility of this function.
            const generatedTemplate = `<form id="${config.formId}">
            <label for="${config.inputId}">${config.inputLabel}</label>
            <input id="${config.inputId}" type="${config.inputType}" aria-describedby="${config.inputId}-instructions"
                ${config.inputType === "number" ? `min="2" max="4"` : ""}>
            <p id="${config.inputId}-instructions">${instructions}</p>
            <button type="submit" hidden>Next</button>
            </form>`
            gameContainer.innerHTML = generatedTemplate
            userInput = document.getElementById(config.inputId)
            document.getElementById(config.formId)
                .addEventListener("submit", (e) => {
                    e.preventDefault()
                    savePlayersIntoState(userInput.value, config)
                    resolve()
                })
            userInput.addEventListener("input", (e) => {
                speechSynth.speak(e.target.value)
            })
        }
        if (state.mode === "init" && state.loading) {
            const generatedTemplate = `<div id="instructions" tabindex="0">${instructions}</div>`
            gameContainer.innerHTML = generatedTemplate
            userInput = document.getElementById("instructions")
            resolve()
        }
        if (state.mode === "started" && !state.loading) {
            const generatedTemplate = `<div id="instructions">${instructions}</div>
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
                toggleSpeech(e, instructions)
            })
        }
    })
}

export { generateInstructions, embedTemplate, savePlayersIntoState, toggleSpeech, loadAudioFile, playAudio, movingPieceSound }