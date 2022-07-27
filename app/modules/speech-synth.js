import EasySpeech from "easy-speech"

class SpeechSynth {
    constructor() {
        // Will be soon
    }

    speak(txt) {
        return new Promise(async (resolve, reject) => {
            try {
                await EasySpeech.init()
                const voices = await EasySpeech.voices()
                let utter = {
                    lang: voices[0].lang,
                    text: txt,
                    voice: voices[0]
                }
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