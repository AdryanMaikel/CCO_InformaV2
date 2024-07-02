const _form = document.getElementById("login");

_form.onsubmit = async function(event) {
    event.preventDefault();
    const response = await fetch(_form.action, { method: _form.method, body: new FormData(_form) });
    const text = await response.text();

    console.log(text);
    if(text == "Operador ou senha inválidos."){
        _form.classList.add("error");
        return;
    }
}
