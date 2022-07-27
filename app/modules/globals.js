class GlobalVars {
    constructor() {
        this.gameContainer = document.getElementById("game-container")
        this.state = {
            players: [],
            currentPlayer: {},
            index: 0,
            currentSound: false
        }
    }
}

export default new GlobalVars()