const _form = document.getElementById("login");
const operator = _form.querySelector("#operator");
const password = _form.querySelector("#password");

let logged = false;

async function login() {
    const response = await fetch(_form.action, { method: _form.method, body: new FormData(_form) });
    if(response.status != 200)return;
    const text = await response.text();

    console.log(text);
    if(text == "Operador ou senha inválidos."){
        _form.classList.add("error");
        return;
    }
    logged = true;
    window.document.title = `${operator.value}🤙`;
    get_chat();
}

async function unlogin() {
    const response = await fetch("/unlogin", { method: "post", body: new FormData(_form) });
    if(response.status != 200)return;
    const text = await response.text();
    console.log(text);
}

_form.onsubmit = async function(event) {
    event.preventDefault();
    login();
}
