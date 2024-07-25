const button_login = document.getElementById("toggle-login");
const form_login = document.getElementById("login");

button_login.addEventListener("click", _=>form_login.classList.add("open"))

form_login.addEventListener("reset", _=>{
    form_login.classList.remove("open");
    console.log("fechou")
});

const operator = form_login.querySelector("#operator");
const password = form_login.querySelector("#password");

let logged = false;

async function toggle_login() {
    const response = await fetch(
        !logged?"/login":"unlogin",
        {
            method: form_login.method,
            body: new FormData(form_login)
        }
    );
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
    button_login.classList.add("active")
    get_chat();
    get_table();
}

async function unlogin() {
    const response = await fetch("/unlogin", { method: "post", body: new FormData(form_login) });
    if(response.status != 200)return;
    const text = await response.text();
    console.log(text);
}

form_login.onsubmit = async function(event) {
    event.preventDefault();
    toggle_login();
}
