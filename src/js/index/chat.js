const chat = document.querySelector("#chat");
const content_chat = document.querySelector("#content-chat");
const span_count_requests_chat = document.querySelector("#count-requests-chat");

let old_messages = "";
let count_requests_chat = 101;
async function get_chat() {
    if(logged == false)return;
    var url = `/chat/${operator.value}/${password.value}`;
    const response = await fetch(url, { method: "GET" });
    if(response.status != 200)return;
    const text = await response.text();
    content_chat.innerHTML = text;
    count_requests_chat -= 1;
    span_count_requests_chat.textContent = `Chat fechando em ${count_requests_chat}`
    if(count_requests_chat <= 0)close_chat()
    if(old_messages == text)return;
    count_requests_chat = 101;
    old_messages = text;
    console.log("Atualizando conversas...");
}

let interval_chat = null;
document.getElementById("open-chat").onclick = async function(_) {
    count_requests_chat = 101;
    await get_chat()
    chat.classList.add("open");
    interval_chat = window.setInterval(get_chat, 1500);
};
function close_chat() {
    window.clearInterval(interval_chat);
    chat.classList.remove("open");
}
document.getElementById("close-chat").onclick = close_chat;

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
    get_chat()
}
document.getElementById("send-message").onclick = post_message;