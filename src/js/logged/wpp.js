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

    // div_who_informed = content_wpp.querySelector("#div_who_informed");
    div_who_informed = new DivEvents(content_wpp.querySelector("#div_who_informed"));
}

load_wpp();

class DivEvents {
    constructor(div) {
        this.div = div;
        this.input = div.querySelector("input");
        this.tresh = div.querySelector("button.surge");
        this.items = div.querySelectorAll(".list .item");
    }

    load() {
        this.div.onclick = () => {
            if (this.div.classList.contains("open")) {
                return;
            }
            this.div.classList.add("open");
            this.items.forEach(item => {
                item.onclick = () => {
                    if (!this.tresh.classList.contains("active")) {
                        this.tresh.classList.add("active");
                    }
                    this.input.value = item.textContent;
                };
            });
        };

        this.tresh.onclick = (event) => {
            event.stopPropagation();
            this.input.value = "";
            this.tresh.classList.remove("active");
            this.input.focus();
        };

        this.input.oninput = (event) => {
            console.log(event);
            if (this.input.value === "" || this.tresh.classList.contains("active")) {
                return;
            }
            this.tresh.classList.add("active");
        };

        this.input.onblur = () => {
            if (this.input.value === "" && this.tresh.classList.contains("active")) {
                this.tresh.classList.remove("active");
            }
            window.setTimeout(() => {
                this.div.classList.remove("open");
                this.items.forEach(item => item.onclick = null);
            }, 150);
        };
    }

    unload() {
        this.div.onclick = null;
        this.tresh.onclick = null;
        this.input.oninput = null;
        this.input.onblur = null;
    }
}

document.querySelector("#open-wpp").onclick = function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
    div_wpp.classList.add("open");

    // Primeira linha
    let div_informed_surge = div_informed.querySelector(".toggle");
    div_informed.onclick = function() {
        if(!div_informed_surge)return;
        div_informed_surge.classList.toggle("active");
    };
    div_who_informed.load()
}

document.querySelector("#close-wpp").onclick = function(_) {
    div_wpp.classList.remove("open");

    // Primeira linha
    div_informed.onclick = null;
    div_who_informed.unload()
}
