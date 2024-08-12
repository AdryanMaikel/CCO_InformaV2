const button_login = document.getElementById("toggle-login");
const form_login = document.getElementById("login");

let logged = false;

button_login.onclick = async function(_) {
    if(document.querySelector(".container.open")||logged)return;
    form_login.classList.add("open");
}

form_login.onreset = function(_) {
    form_login.classList.remove("open");
}

const operator = form_login.querySelector("#operator");
const password = form_login.querySelector("#password");

async function login() {
    if(logged){
        form_login.classList.remove("open");
        return;
    }
    const response = await fetch(
        "/login", { method: "post", body: new FormData(form_login) }
    );
    console.log(`Logando... ${await response.text()}`);
    if(response.status != 200){
        form_login.classList.add("error");
        return;
    }
    form_login.classList.remove("open", "error");
    window.document.title = `${operator.value} 🤙`;
    button_login.classList.add("active")
    logged = true;   
    await load_containers();
}

async function unlogin() {
    await fetch(
        "/unlogin", { method: "post", body: new FormData(form_login) }
    );
}

form_login.onsubmit = async function(event) {
    event.preventDefault();
    if(logged)form_login.reset()
    login();
}

window.onload = async function(_) {
    if(operator && operator.value != "" && password && password.value != "")
        login();
}

window.onbeforeunload = async function(event) {
    event.preventDefault();
    if(logged)await unlogin();
    event.returnValue = "";
}
