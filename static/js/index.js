const menu_config = document.getElementById("menu-config");
document.getElementById("config-open").onclick = () => menu_config.classList.add("open");
document.getElementById("config-close").onclick = () => menu_config.classList.remove("open");

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe");
// iframe.addEventListener("load", _=>overlay.classList.add("hidden"));
// window.addEventListener("message", _=>overlay.classList.remove("hidden"))
iframe.onload = () => overlay.classList.add("hidden");
window.onmessage = () => overlay.classList.remove("hidden");

const login = document.getElementById("login");
const cancel_login = document.getElementById("login-cancel");


document.getElementById("user").onclick = () => {
    login.classList.add("open");


    cancel_login.onclick = () => login.classList.remove("open");
}
