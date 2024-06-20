const menu_config = document.getElementById("menu-config");
document.getElementById("config-open").onclick = () => menu_config.classList.add("open");
document.getElementById("config-close").onclick = () => menu_config.classList.remove("open");

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe");

iframe.onload = () => overlay.classList.add("hidden");

window.onmessage = ({ data }) => {
    if (data === "reload") {
      overlay.classList.remove("hidden");
      setTimeout(() => {
        iframe.contentWindow.location.reload();
      }, 500);
    }
};

