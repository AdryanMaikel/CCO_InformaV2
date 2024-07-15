const div_buttons_login = document.getElementById("div-buttons-login");
const form_login = document.getElementById("login");

document.getElementById("button-login").addEventListener("click", function(event){
    form_login.classList.add("open");

})
form_login.addEventListener("reset", _=>{form_login.classList.remove("open");console.log("fechou")});

const operator = form_login.querySelector("#operator");
const password = form_login.querySelector("#password");

let logged = false;

async function login() {
    const response = await fetch(form_login.action, { method: form_login.method, body: new FormData(form_login) });
    if(response.status != 200)return;
    const text = await response.text();

    console.log(text);
    if(text == "Operador ou senha inválidos."){
        form_login.classList.add("error");
        form_login.classList.remove("open");
        return;
    }
    form_login.classList.remove("open");
    logged = true;
    window.document.title = `${operator.value} 🤙`;
    div_buttons_login.classList.add("active")
    get_chat();
}

async function unlogin() {
    const response = await fetch("/unlogin", { method: "post", body: new FormData(form_login) });
    if(response.status != 200)return;
    const text = await response.text();
    console.log(text);
}

form_login.onsubmit = async function(event) {
    event.preventDefault();
    login();
}
