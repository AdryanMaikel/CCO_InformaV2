const div_wpp = document.getElementById("wpp");
const content_wpp = div_wpp.querySelector(".content");

let div_informed = null;

async function load_wpp(){
    const response = await fetch(`/wpp/${operator.value}/${password.value}`)
    if(response.status != 200)return;
    content_wpp.innerHTML = await response.text();

    // Informado?
    div_informed = content_wpp.querySelector("#informed");

    who_informed.addEventListener("focus", function(){
        who_informed.parentElement.classList.add("open");
        who_informed.parentElement.querySelectorAll(".list ")
    });
    who_informed.addEventListener("blur", function(){        
        window.setTimeout(()=>who_informed.parentElement.classList.remove("open"), 500);
    });
}

load_wpp()

function toogle_informed(){
    div_informed.querySelector(".surge").classList.toggle("active");
}


document.querySelector("#open-wpp").onclick = function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
    div_wpp.classList.add("open");

    div_informed.onclick = toogle_informed;

}

document.querySelector("#close-wpp").onclick = function(_) {
    div_wpp.classList.remove("open");

    div_informed.onclick = null;
}
