const chat = document.querySelector("#chat");
const content_chat = chat.querySelector("#content-chat");
const span_count_requests_chat = document.querySelector("#count-requests-chat");

let interval_chat = null;
let interval_new_messages = null;

let html_content_old = "";
let count_requests_chat_to_close = 100;

function update_chat(html_content) {
    html_content_old = html_content;
    content_chat.innerHTML = html_content;
    content_chat.scrollTop = content_chat.scrollHeight;
    buttons_copy_message = content_chat.querySelectorAll("button.copy");
    buttons_delete_message = content_chat.querySelectorAll("button.delete");
}

let buttons_copy_message = null;
let buttons_delete_message = null;

async function get_chat() {
    const html_content = await request("chat", "GET");
    count_requests_chat_to_close -= 1;
    span_count_requests_chat.textContent = count_requests_chat_to_close;
    if (count_requests_chat_to_close <= 0) close_chat();
    if (html_content == html_content_old) return;
    update_chat(html_content);
}

function add_events_buttons() {
    buttons_copy_message.forEach(button => button.onclick = function() {
        const pre = this.closest("div.message").querySelector("pre");
        navigator.clipboard.writeText(pre.textContent.trim());
        console.log("copiado");
    });
    buttons_delete_message.forEach(button => button.onclick = async function() {
        await request("chat", "DELETE", { row: parseInt(button.getAttribute("row")) });
        await get_chat();
    });
}

function remove_events_buttons() {
    buttons_copy_message.forEach(button => button.onclick = null);
    buttons_delete_message.forEach(button => button.onclick = null);
}

async function check_new_messages() {
    const html_content = await request("chat", "GET");
    if (html_content == html_content_old) return;
    button_open_chat.classList.add("new-messages");
}

async function open_chat() {
    if (document.querySelector(".container.open")||form_login.classList.contains("open"))
        return;
    if (button_open_chat.classList.contains("new-messages")) {
        button_open_chat.classList.remove("new-messages");
    }
    await get_chat();
    add_events_buttons();
    chat.classList.add("open");
    window.clearInterval(interval_new_messages);
    interval_chat = window.setInterval(get_chat, 1500);
}

function close_chat() {
    chat.classList.remove("open");
    remove_events_buttons();
    window.clearInterval(interval_chat);
    count_requests_chat_to_close = 100;
    interval_new_messages = window.setInterval(check_new_messages, 6000);
}

const textarea_message = chat.querySelector("textarea#message");

async function send_message() {
    const message = textarea_message.value.trim();    
    if (message == "") return;
    if (await request("chat", "POST", { message })) {
        textarea_message.value = "";
        await get_chat();
    }
}

get_chat();
interval_new_messages = window.setInterval(check_new_messages, 6000);

const button_open_chat = document.getElementById("open-chat");
button_open_chat.onclick = open_chat;

const button_close_chat = chat.querySelector("#close-chat");
button_close_chat.onclick = close_chat;

const button_send_message = chat.querySelector("#send-message");
button_send_message.onclick = send_message;

textarea_message.onkeydown = function(event) {
    if (event.key == "Enter" && !event.shiftKey) {
        send_message();
    }
}
