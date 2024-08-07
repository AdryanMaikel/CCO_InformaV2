const div_wpp = document.getElementById("wpp");

document.getElementById("open-cco-wpp").onclick = function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
    div_wpp.classList.add("open");

}

document.querySelector("#close-wpp").onclick = function(_) {
    div_wpp.classList.remove("open");
}