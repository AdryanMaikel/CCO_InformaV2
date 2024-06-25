const login = document.getElementById("login");

const operator = login.querySelector("#operator");
const password = login.querySelector("#password");

const bnt_submit_login = login.querySelector("#submit-login");
const btn_cancel_login = login.querySelector("#cancel-login");

function toggle_disabled(bool = null) {
    if(!bool) bool = !operator.disabled;
    operator.disabled = bool;
    password.disabled = bool;
    bnt_submit_login.disabled = bool;
    btn_cancel_login.disabled = bool;
}


function reset_login(event = {}, operator_value = "", password_value = "") {
    toggle_disabled(true)
    operator.value = operator_value;
    password.value = password_value;
    login.classList.remove("open");
}

function create_form(action = "error", method = "POST", inputs = []) {
    const form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", method);
    inputs.forEach(input=>{
        const _input = document.createElement("input");
        _input.name = input.name;
        _input.value = input.value;
        form.appendChild(_input);
    });
    return form;
}
const btn_user = document.getElementById("user");

async function check_login() {
    if(!overlay.classList.contains("hidden")){
        overlay.classList.add("hidden");
        setTimeout(()=>overlay.classList.remove("hidden"), 100)
    }
    const form = create_form("/login", "POST", [operator, password]);
    const form_data = new FormData(form);
    try {
        const response = await fetch("/login", {method: "POST", body: form_data});
        const text = await response.text();
        console.log(text)
        if(text == "not-found"){
            login.classList.add("error");
            return;
        }
        iframe.src = text;
        login.classList.remove("open");
        btn_user.classList.add("true");
        const json_login = JSON.stringify({user: operator.value, password: password.value})
        document.cookie=`login=${json_login}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    } catch (error) {
        console.log(error);
    }
}

btn_user.onclick = () => {
    if(btn_user.classList.contains("true")){
        document.cookie.split(";").find(cookie=>{
            if(cookie.trim().startsWith("login=")){
                document.cookie=`login={}; expires=Fri, 31 Dec 1900 23:59:59 GMT; path=/`;
            }
        });
        window.location.reload();
        return;
    }
    toggle_disabled(false)
    login.classList.add("open");
    bnt_submit_login.onclick = check_login;
    btn_cancel_login.onclick = reset_login;
}

const chat = document.getElementById("chat");
document.getElementById("messages").onclick = _ => load_chat(operator.value, password.value);
document.getElementById("close-chat").onclick = _ => clear_chat();

const content_chat = document.getElementById("content-chat");
var interval_chat = null;

async function load_chat(name, password) {
    chat.classList.add("open");

    const response = await fetch(`/chat/${name}/${password}`);
    const html = await response.text();
    content_chat.innerHTML = html;

    interval_chat = setInterval(async _ => {
        try {
            const response = await fetch(`/chat/${name}/${password}`);
            const html = await response.text();
            content_chat.innerHTML = html;
            console.log(html)
        } catch (error) {
            console.log(error)
        }
    }, 500)
}

function clear_chat() {
    chat.classList.remove("open");
    clearInterval(interval_chat);
}

if(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("login="))){
    const config = JSON.parse(decodeURIComponent(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("login=")).split("=")[1]))
    toggle_disabled(false)
    operator.value = config.user;
    password.value = config.password;
    if(config.password && config.user)
        check_login();
        // load_chat(operator.value, password.value)
        toggle_disabled(true);
}
