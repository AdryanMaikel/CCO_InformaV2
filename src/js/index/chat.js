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
  


// window.setInterval(()=>{}, 1000)
