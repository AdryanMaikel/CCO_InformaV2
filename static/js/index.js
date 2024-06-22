const menu_config = document.getElementById("menu-config");
document.getElementById("config-open").onclick = () => menu_config.classList.add("open");
document.getElementById("config-close").onclick = () => menu_config.classList.remove("open");

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe");

iframe.onload = () => overlay.classList.add("hidden");

window.onmessage = ({ data }) => {
  if(data.includes("-")){

    const split_data = data.split("-");
    if(split_data[0] != "logout")return;

    logout(split_data[1])
  }
  if (data === "reload") {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      iframe.contentWindow.location.reload();
    }, 500);
  }
};

async function logout(operator = "") {
  if(!operator)return;

  const response = fetch("/logout/"+operator, {method: "POST"})
  await response.then(response=>console.log(response.text()))
  await response.catch(response=>console.log(response.text()))
}
