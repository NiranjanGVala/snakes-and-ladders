import "./css/style.css"
import init from "./modules/init"

window.onload = () => {
    init.firstScreenWidgit()
}

if (module.hot) {
    module.hot.accept()
}