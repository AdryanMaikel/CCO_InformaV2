const div_wpp = document.getElementById("wpp");
const content_wpp = div_wpp.querySelector(".content");

let div_informed = null;
let div_who_informed = null;

async function load_wpp(){
    const response = await fetch(`/wpp/${operator.value}/${password.value}`)
    if(response.status != 200)return;
    content_wpp.innerHTML = await response.text();

    // Informado?
    div_informed = content_wpp.querySelector("#informed");
    div_who_informed = content_wpp.querySelector("#div_who_informed");

}

load_wpp();

function create_events(div) {
    const input = div.querySelector(`input`);
    const items = div.querySelectorAll(`.list .item`);
    const tresh = div.querySelector("button.surge");
    div.onclick = function() {
        if(div.classList.contains("open"))
            return;
        div.classList.add("open");
        items.forEach(item=>item.onclick = function() {
            if(!tresh.classList.contains("active"))
                tresh.classList.add("active");
            input.value = item.textContent;
        });
    };
    tresh.onclick = function(event) {
        event.stopPropagation();
        input.value = "";
        tresh.classList.remove("active");
        input.focus();
        
    }
    input.oninput = function(event) {
        console.log(event);
        if(input.value == "" || tresh.classList.contains("active"))
            return;
        tresh.classList.add("active");
    }
    input.onblur = function() {
        if(input.value == "" && tresh.classList.contains("active"))
            tresh.classList.remove("active");
        
        window.setTimeout(function() {
            div.classList.remove("open");
            items.forEach(item=>item.onclick = null);
        }, 150);
    };
}

function remove_events(div) {
    div.onclick = null;
    div.querySelector(`input`).onblur = null;
}

document.querySelector("#open-wpp").onclick = function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
    div_wpp.classList.add("open");

    // Primeira linha
    let div_informed_surge = div_informed.querySelector(".toggle");
    console.log("1")
    div_informed.onclick = function() {
        if(!div_informed_surge)return;
        div_informed_surge.classList.toggle("active");
    };

    create_events(div_who_informed);

}

document.querySelector("#close-wpp").onclick = function(_) {
    div_wpp.classList.remove("open");

    div_informed.onclick = null;
    console.log("1")

    remove_events(div_who_informed);
}
