document.getElementById("config").onclick = _=>document.getElementById("menu-config").classList.add("open")
document.getElementById("config-close").onclick = _=>document.getElementById("menu-config").classList.remove("open")

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe");
iframe.addEventListener("load", event=>{
    overlay.classList.add("hidden");
    console.log("load")
});

window.addEventListener("message", event=>{
    console.log(event.data)
    overlay.classList.remove("hidden");
})
