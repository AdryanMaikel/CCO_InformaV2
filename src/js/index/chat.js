const chat = document.querySelector("#chat");
const content_chat = document.querySelector("#content-chat");

let old_messages = "";

async function get_chat() {
    if(logged == false)return;
    var url = `/chat/${operator.value}/${password.value}`;
    const response = await fetch(url, { method: "GET" });
    const text = await response.text();
    
    if(old_messages == text)return;
    old_messages = text;
    content_chat.innerHTML = text;
}

document.getElementById("open-chat").onclick = _ => chat.classList.add("open");
document.getElementById("close-chat").onclick = _ => chat.classList.remove("open");


const textarea = document.querySelector("textarea#message");

async function post_message() {
    const _form = document.createElement("form");
    _form.appendChild(textarea.cloneNode(false));
    _form.appendChild(operator.cloneNode(false));
    _form.appendChild(password.cloneNode(false));

    const form = new FormData(_form);
    const response = await fetch(`/post-message`, { method: "post", body: form});
    const text = await response.text()
    console.log(text)
}

document.querySelector("#send-message").onclick = () => post_message();

// window.setInterval(()=>{
//     get_chat()
// }, 1000)
