const div_config = document.getElementById("config");

document.getElementById("open-config").onclick = function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open")){
        return;
    }
    div_config.classList.add("open");
}

document.getElementById("close-config").onclick = function(_) {
    div_config.classList.remove("open");
}