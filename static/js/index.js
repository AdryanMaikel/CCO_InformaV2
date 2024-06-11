document.getElementById("config").onclick = _=>document.getElementById("menu-config").classList.add("open")
document.getElementById("config-close").onclick = _=>document.getElementById("menu-config").classList.remove("open")

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe");
iframe.addEventListener("load", _=>overlay.classList.add("hidden"));
window.addEventListener("message", _=>overlay.classList.remove("hidden"))
