import EasySpeech from "easy-speech"

class SpeechSynth {
    constructor() {
        this.voices = []
    }

    // Private properties
    #initialized = false
    #defaultUtter = {}

    // Private methods
    #init() {
        return new Promise(async (resolve, reject) => {
            await EasySpeech.init({ maxTimeout: 5000, interval: 250 })
            let voices = await EasySpeech.voices()
            this.voices = voices.filter((voice) => {
                if (voice.default) {
                    this.#defaultUtter.lang = voice.lang
                    this.#defaultUtter.voice = voice
                }
                return /en/.test(voice.lang)
            })
            resolve(true)
        })
    }

    speak(txt) {
        return new Promise(async (resolve, reject) => {
            this.#initialized = this.#initialized ? this.#initialized : await this.#init()
            let utter = Object.create(this.#defaultUtter)
            utter.text = txt
            try {
                await EasySpeech.speak(utter)
                resolve()
            } catch (e) {
                console.log(e)
                reject()
            }
        })
    }
}

export default new SpeechSynth()