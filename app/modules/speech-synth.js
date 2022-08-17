import state from "./state"

class SpeechSynth {
    constructor() {
        this.voices = []
    }

    // Private properties
    #speech = window.speechSynthesis
    #initialized = false
    #DefaultUtterConfig = {}

    // Private methods
    #init() {
        return new Promise(async (resolve, reject) => {
            this.voices = this.#speech.getVoices()
            this.voices = this.voices.filter((voice) => {
                if (voice.default) {
                    this.#DefaultUtterConfig.lang = voice.lang
                    this.#DefaultUtterConfig.voice = voice
                }
                return /en/.test(voice.lang)
            })
            this.#initialized = true
            resolve()
        })
    }

    speak(txt, force) {
        this.#speech.cancel()
        return new Promise(async (resolve, reject) => {
            if (state.speech) {
                this.#initialized = this.#initialized ? this.#initialized : await this.#init()
                if (speechSynthesis.onvoiceschanged !== undefined) {
                    speechSynthesis.onvoiceschanged = await this.#init
                }
                let utter = new SpeechSynthesisUtterance(txt)
                utter.lang = this.#DefaultUtterConfig.lang
                utter.voice = this.#DefaultUtterConfig.voice
                this.#speech.speak(utter)
                utter.onend = () => {
                    resolve()
                }
                if (force) {
                    force.cancel = () => {
                        resolve()
                    }
                }
            } else {
                reject()
            }
        })
    }
}

export default new SpeechSynth()