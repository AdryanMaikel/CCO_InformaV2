const chat = document.querySelector("#chat");
const content_chat = document.querySelector("#content-chat");

let old_messages = "";

async function get_chat() {
    if(logged == false)return;
    var url = `/chat/${operator.value}/${password.value}`;
    const response = await fetch(url, { method: "GET" });
    if(response.status != 200)return;
    const text = await response.text();
    if(old_messages == text)return;
    old_messages = text;
    console.log("Atualizando conversas...");
    content_chat.innerHTML = text;
}

let interval_chat = null;

document.getElementById("open-chat").onclick = async function(_) {
    await get_chat()
    chat.classList.add("open");
    interval_chat = window.setInterval(get_chat, 1500);
};

document.getElementById("close-chat").onclick = function(_) {
    window.clearInterval(interval_chat);
    chat.classList.remove("open");
};

const textarea = document.querySelector("textarea#message");

async function post_message() {
    const _form = document.createElement("form");
    _form.appendChild(textarea.cloneNode(false));
    _form.appendChild(operator.cloneNode(false));
    _form.appendChild(password.cloneNode(false));

    const response = await fetch(`/post-message`, { method: "post", body: new FormData(_form)});
    console.log(response.status)
    if(response.status != 200)return;
    const text = await response.text()
    console.log(text)
}

document.querySelector("#send-message").onclick = () => post_message();

// window.setInterval(()=>{
//     get_chat()
// }, 1000)
