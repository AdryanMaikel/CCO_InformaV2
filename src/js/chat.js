async function load_chat() {
    var url = `/chat/${operator.value}/${password.value}`;
    const response = await fetch(url, { method: "GET" })
    const text = await response.text()

    console.log(text)
    document.querySelector("#content-chat").innerHTML = text;
}

load_chat()