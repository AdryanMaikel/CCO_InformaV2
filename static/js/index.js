const menu_config = document.getElementById("menu-config");
document.getElementById("config-open").onclick = () => menu_config.classList.add("open");
document.getElementById("config-close").onclick = () => menu_config.classList.remove("open");

const overlay = document.getElementById("overlay");
const iframe = document.querySelector("iframe");

iframe.onload = () => overlay.classList.add("hidden");

window.onmessage = ({data}) => {
    if(data == "reload"){
        overlay.classList.remove("hidden");
        setTimeout(()=>iframe.contentWindow.location.reload(), 500);
    }
};

const login = document.getElementById("login");

const operator = login.querySelector("#operator");
const password = login.querySelector("#password");

function reset_login(event = {}, operator_value = "", password_value = "") {
    operator.disabled = true;
    password.disabled = true;
    bnt_submit_login.disabled = true;
    btn_cancel_login.disabled = true;
    operator.value = operator_value;
    password.value = password_value;
    login.classList.remove("open");
}

function create_form(action = "error", method = "POST", inputs = []) {
    const form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", method);
    inputs.forEach(input=>form.appendChild(input.cloneNode(false)));
    return form;
}
const btn_user = document.getElementById("user");

async function check_login() {
    overlay.classList.remove("hidden");
    const form = create_form("/login", "POST", [operator, password]);
    const form_data = new FormData(form);
    try {
        const response = await fetch("/login", {method: "POST", body: form_data});
        const text = await response.text();
        if(text == "not-found"){
            login.classList.add("error");
            return;
        }
        iframe.setAttribute("src", text);
        login.classList.remove("open");
        btn_user.classList.add("true");
        const json_login = JSON.stringify({user: operator.value, password: password.value})
        document.cookie=`login=${json_login}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    } catch (error) {
        console.log(error);
    }
}

const bnt_submit_login = login.querySelector("#submit-login");
const btn_cancel_login = login.querySelector("#cancel-login");

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
    operator.disabled = false;
    password.disabled = false;
    bnt_submit_login.disabled = false;
    btn_cancel_login.disabled = false;
    login.classList.add("open");
    bnt_submit_login.onclick = check_login;
    btn_cancel_login.onclick = reset_login;
}


if(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("login="))){
    const config = JSON.parse(decodeURIComponent(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("login=")).split("=")[1]))
    console.log("teste2")
    operator.value = config.user;
    password.value = config.password;
    if(config.password && config.user)
        check_login()
}
