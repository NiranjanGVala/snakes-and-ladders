import { gameContainer } from "./globals"
import state from "./state"
import speechSynth from "./speech-synth"
import Player from "./player"

const gameMusic = function (file) {
    const audio = new Audio(file)
    audio.volume = 0.05
    return audio
}

const pieceMovement = function (count) {
    const audio = gameMusic("/media/step.mp3")
    audio.volume = 1
    if (count) {
        audio.play()
    }
    audio.addEventListener("ended", () => {
        pieceMovement(count - 1)
    })
}

function saveState(template, value) {
    if (template.inputId === "numberOfPlayers" && !state.players.length) {
        let i = 0
        for (i; i < value; i++) {
            let ownSound = gameMusic(`/media/player_${i + 1}.mp3`)
            state.players.push(new Player(ownSound))
        }
    } else {
        state.players[state.index].name = value ? value : `Player ${state.index + 1}`
    }
}

export async function embedTemplate(instructions, template, next) {
    let userInput = ""
    if (template.mode !== "gameStarted") {
        instructions += " To hear these instructions again, press ctrl + j"
        const generatedTemplate = `<form id="${template.formId}">
            <label for="${template.inputId}">${template.inputLabel}</label>
            <input id="${template.inputId}" type="${template.inputType}" aria-describedby="${template.inputId}-instructions"
                ${template.inputType === "number" ? `min="1" max="4"` : ""}>
            <p id="${template.inputId}-instructions">${instructions}</p>
            <button type="submit" hidden>Next</button>
        </form>`
        gameContainer.innerHTML = generatedTemplate
        userInput = document.getElementById(template.inputId)
        document.getElementById(template.formId)
            .addEventListener("submit", (e) => {
                e.preventDefault()
                saveState(template, userInput.value)
                next()
            })
        userInput.addEventListener("input", (e) => {
            speechSynth.speak(e.target.value)
        })
        speechSynth.speak(instructions)
    }
    if (template.mode === "gameStarted" && !template.loading) {
        instructions += " To hear these instructions again, press CTRL + j."
        const generatedTemplate = `<p>${instructions}</p>
        <button id="${template.inputId}">${template.inputLabel}</button>`
        gameContainer.innerHTML = generatedTemplate
        userInput = document.getElementById(template.inputId)
        userInput.addEventListener("click", next)
        speechSynth.speak(instructions)
    }
    if (template.mode === "gameStarted" && template.loading) {
        const generatedTemplate = `<p>${instructions}</p>`
        gameContainer.innerHTML = generatedTemplate
        await speechSynth.speak(instructions)
        next()
    }
    if (userInput) {
        userInput.focus()
        userInput.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === "j") {
                e.preventDefault()
                speechSynth.speak(instructions)
            }
        })
    }
}

export function introMusic() {
    return new Promise((resolve, reject) => {
        const intro = new Audio("/media/intro.mp3")
        intro.preload = "metadata"
        intro.addEventListener("loadedmetadata", () => {
            intro.volume = 0.05
            resolve(intro)
        })
    })
}

export { gameMusic, pieceMovement }