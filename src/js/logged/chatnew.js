const chat = document.querySelector("#chat");
const button_open_chat = document.getElementById("open-chat");
const content_chat = chat.querySelector("#content-chat");
const span_count_requests_chat = document.querySelector("#count-requests-chat");

let old_messages = "";
let count_requests_chat = 100;

let buttons_copy = [];
let buttons_delete = [];

let interval_chat, interval_new_message = null;

async function init_chat() {
    update_chat(await get_chat());
    interval_new_message = window.setInterval(monitor_new_message, 1000);
}

async function get_chat() {
    const response = await fetch(`/chat/${operator.value}/${password.value}`);
    if(response.status != 200)return;
    return await response.text();
}

function open_chat() {}

function close_chat() {
    window.clearInterval(interval_chat);
    interval_chat = window.setInterval(monitor_chat, 5500);
    chat.classList.remove("open");
    remove_click_buttons();
}

function update_chat(text) {
    console.log("Atualizando chat...");
    old_messages = text;
    content_chat.innerHTML = text;
    content_chat.scrollTop = content_chat.scrollHeight;
    buttons_copy = content_chat.querySelectorAll("button.copy");
    buttons_delete = content_chat.querySelectorAll("button.delete");
}

async function monitor_new_message() {
    const text = await get_chat();
    if (text == old_messages) return;
    window.clearInterval(interval_new_message);
    button_open_chat.classList.add("new-message");
}

init_chat();


async function monitor_chat() {
    const text = await get_chat();
    if (!chat.classList.contains("open") && old_messages != text) {
        button_open_chat.classList.add("new-message");
        window.clearInterval(interval_chat);
        return;
    }
    count_requests_chat -= 1;
    span_count_requests_chat.textContent = `Chat fechando em ${count_requests_chat}`;
    if (count_requests_chat <= 0) {
        close_chat();
        return;
    }
    if (text == old_messages) return;
    update_chat(text);
}

function active_click_buttons() {
    buttons_copy.forEach(button => button.onclick = function() {
        const pre = this.closest("div.message").querySelector("pre");
        navigator.clipboard.writeText(pre.textContent.trim());
        console.log("copiado");
    });

    buttons_delete.forEach(button => button.onclick = async function() {
        const json = { row: parseInt(button.getAttribute("row")) };
        const response = await fetch(
            `/chat/${operator.value}/${password.value}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json)
            }
        )
        if(response.status != 200)return;
        console.log(await response.text());
        update_chat(await get_chat());
    });
}

function remove_click_buttons() {
    buttons_copy.forEach(button => button.onclick = null);
    buttons_delete.forEach(button => button.onclick = null);
}


button_open_chat.onclick = async function() {
    if (section.querySelector(".container.open") || form_login.classList.contains("open"))
        return;
    if (button_open_chat.classList.contains("new-message")) {
        button_open_chat.classList.remove("new-message");
    }
    count_requests_chat = 101;
    chat.classList.add("open");
    window.clearInterval(interval_chat);
    interval_chat = window.setInterval(monitor_chat, 1500);
    active_click_buttons();
};

document.getElementById("close-chat").onclick = close_chat;

const textarea = document.querySelector("textarea#message");

async function post_message() {
    if (textarea.value.trim() == "") return;
    const response = await fetch(
        `/chat/${operator.value}/${password.value}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: textarea.value })
        }
    );
    if(response.status != 200)return;
    console.log(await response.text());
    textarea.value = "";
    update_chat(await get_chat());
}
document.getElementById("send-message").onclick = post_message;