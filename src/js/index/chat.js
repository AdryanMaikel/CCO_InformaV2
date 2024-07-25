const chat = document.querySelector("#chat");
const content_chat = document.querySelector("#content-chat");
const span_count_requests_chat = document.querySelector("#count-requests-chat");

let old_messages = "";
let count_requests_chat = 99;
async function get_chat() {
    if(logged == false)return;
    var url = `/chat/${operator.value}/${password.value}`;
    const response = await fetch(url, { method: "GET" });
    if(response.status != 200)return;
    const text = await response.text();
    count_requests_chat -= 1;
    span_count_requests_chat.textContent = `Chat fechando em ${count_requests_chat}`
    if(count_requests_chat <= 0)close_chat()
    console.log(old_messages == text)
    if(old_messages == text)return;
    count_requests_chat = 99;
    old_messages = text;
    content_chat.innerHTML = text;
    
    content_chat.scrollTop = content_chat.scrollHeight;

    content_chat.querySelectorAll("button.copy").forEach(button => {
        button.addEventListener("click", function() {
            const text = button.closest("div.message").querySelector("pre").textContent;
            navigator.clipboard.writeText(text.trim());
            console.log("copiado");
        });
    });

    content_chat.querySelectorAll("button.delete").forEach(button => {

    });
    console.log("Atualizando conversas...");
}

let interval_chat = null;
document.getElementById("open-chat").onclick = async function(_) {
    if(chat.classList.contains("open")
    || form_login.classList.contains("open")
    // || cco_wpp.classList.contains("open")
    // || config.classList.contains("open")
    )return;
    count_requests_chat = 101;
    await get_chat()
    chat.classList.add("open");
    interval_chat = window.setInterval(get_chat, 1500);
};
function close_chat() {
    window.clearInterval(interval_chat);
    chat.classList.remove("open");
}
document.getElementById("close-chat").onclick = _=>{close_chat()};

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
    textarea.value = "";
    get_chat()
}
document.getElementById("send-message").onclick = post_message;