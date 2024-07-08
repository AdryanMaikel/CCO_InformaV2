const _form = document.getElementById("login");
const operator = _form.querySelector("#operator");
const password = _form.querySelector("#password");

let logged = false;

async function login() {
    const response = await fetch(_form.action, { method: _form.method, body: new FormData(_form) });
    const text = await response.text();

    console.log(text);
    if(text == "Operador ou senha inválidos."){
        _form.classList.add("error");
        return;
    }
    logged = true;
    get_chat()
}

window.onload = async function(event) {
    if(operator && operator.value != "" && password && password.value != "")
        login()
}

_form.onsubmit = async function(event) {
    event.preventDefault();
    login()
}
