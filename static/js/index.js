const menu_config = document.getElementById("menu-config");
document.getElementById("config-open").onclick = _ => menu_config.classList.add("open");
document.getElementById("config-close").onclick = _ => menu_config.classList.remove("open");

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe#table");

iframe.onload = _ => overlay.classList.add("hidden");

window.onmessage = ({ data }) => {
    if(data.includes("-")){
        const split_data = data.split("-");
        if(split_data[0] == "logout") logout(split_data[1]);
    }
    if (data === "reload") {
        overlay.classList.remove("hidden");
        setTimeout(_=>iframe.contentWindow.location.reload(), 1000);
    }
};

async function logout(operator = "") {
    if(!operator)return;

    const response = fetch("/logout/"+operator, {method: "POST"});
    await response.then(r=>console.log(r.text()));
    await response.catch(r=>console.log(r.text()));
}
