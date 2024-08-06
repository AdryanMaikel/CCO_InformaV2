const chat = document.querySelector("#chat");
const content_chat = document.querySelector("#content-chat");
const span_count_requests_chat = document.querySelector("#count-requests-chat");

let old_messages = "";
let count_requests_chat = 99;
async function get_chat() {
    if(logged == false)return;
    const response = await fetch(
        `/chat/${operator.value}/${password.value}`, { method: "GET" }
    );
    if(response.status != 200)return;
    const text = await response.text();
    count_requests_chat -= 1;
    span_count_requests_chat.textContent = `Chat fechando em ${count_requests_chat}`;
    if(count_requests_chat <= 0)close_chat();
    if(old_messages == text)return;
    count_requests_chat = 99;
    old_messages = text;
    content_chat.innerHTML = text;
    content_chat.scrollTop = content_chat.scrollHeight;

    content_chat.querySelectorAll("button.copy").forEach(
        button => button.onclick = function() {
            const pre = this.closest("div.message").querySelector("pre");
            navigator.clipboard.writeText(pre.textContent.trim());
            console.log("copiado");
        }
    );

    content_chat.querySelectorAll("button.delete").forEach(
        button => button.onclick = async function() {
            const json = { row: parseInt(button.getAttribute("row")) };
            const response = await fetch(
                `/message-delete/${operator.value}/${password.value}`,
                {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(json)
                }
            )
            if(response.status != 200)return;
            console.log(await response.text());
            get_chat();
        }
    );
    console.log("Atualizando conversas...");
}

let interval_chat = null;
const section = document.querySelector("section");
document.getElementById("open-chat").onclick = async function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
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
    const json = {
        message: textarea.value,
        operator: operator.value,
        password: password.value
    }
    const response = await fetch(
        `/post-message`,
        {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        }
    );
    console.log(response.status)
    if(response.status != 200)return;
    const text = await response.text()
    console.log(text)
    textarea.value = "";
    get_chat()
}
document.getElementById("send-message").onclick = post_message;