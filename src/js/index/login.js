const button_login = document.getElementById("toggle-login");
const form_login = document.getElementById("login");

button_login.addEventListener("click", function(_) {
    if(section.querySelector(".container.open"))return;
    form_login.classList.add("open");
});

form_login.addEventListener("reset", function(_) {
    form_login.classList.remove("open");
});

const operator = form_login.querySelector("#operator");
const password = form_login.querySelector("#password");

let logged = false;

async function login() {
    if(logged){
        form_login.classList.remove("open");
        return;
    }
    const response = await fetch(
        "/login", { method: "post", body: new FormData(form_login) }
    );
    if(response.status != 200)return;
    const text = await response.text();
    if(text == "Operador ou senha inválidos."){
        form_login.classList.add("error");
        form_login.classList.remove("open");
        return;
    }
    form_login.classList.remove("open");
    logged = true;
    window.document.title = `${operator.value} 🤙`;
    button_login.classList.add("active")
    get_chat();
    get_table();
}

async function unlogin() {
    await fetch(
        "/unlogin", { method: "post", body: new FormData(form_login) }
    );
}

form_login.onsubmit = async function(event) {
    event.preventDefault();
    login();
}
window.onload = async function(_) {
    if(operator && operator.value != "" && password && password.value != "")
        login();
}
window.onbeforeunload = async function(_) {
    if(logged) await unlogin();
}
