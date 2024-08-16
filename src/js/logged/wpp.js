const div_wpp = document.getElementById("wpp");
const content_wpp = div_wpp.querySelector(".content");

class DivEvents {
    constructor(div) {
        this.div = div;
        this.input = div.querySelector("input");
        this.tresh = div.querySelector("button.surge");
        this.items = div.querySelectorAll(".list .item");
    }

    active_events() {
        this.input.onfocus = (event) => {
            if (this.div.classList.contains("open")) {
                event.target.blur();
                return;
            }
            this.div.classList.add("open");
            this.items.forEach(item => item.onclick = ({target}) => {
                if (!this.tresh.classList.contains("active"))
                    this.tresh.classList.add("active");
                this.input.value = target.textContent;
            });
        };

        this.tresh.onclick = (event) => {
            event.stopPropagation();
            this.input.value = "";
            this.tresh.classList.remove("active");
        };

        this.input.oninput = (event) => {
            if (this.input.value === "") {
                return;
            }
            this.tresh.classList.add("active");
            let elements = [];
            this.items.forEach(item => {
                if (!item.textContent.toLowerCase().includes(this.input.value.toLowerCase())) {
                    item.classList.add("h0");
                } else {
                    item.classList.remove("h0");
                    elements.push(item);
                }
            });
            if (elements.length == 1) {
                this.input.value = elements[0].textContent;
                event.target.blur();
            }
        };

        this.input.onblur = () => {
            if (this.input.value === "" && this.tresh.classList.contains("active")) {
                this.tresh.classList.remove("active");
            }
            window.setTimeout(() => {
                this.div.classList.remove("open");
                this.items.forEach(item => item.onclick = null);
            }, 100);
        };
    }

    remove_events() {
        this.input.onfocus = null;
        this.tresh.onclick = null;
        this.input.oninput = null;
        this.input.onblur = null;
    }
}

let div_informed = null;
let div_who_informed = null;
let replace = null;
let car_substitute = null;
let div_directions = null;
let div_event = null;

async function load_wpp(){
    const response = await fetch(`/wpp/${operator.value}/${password.value}`)
    if(response.status != 200)return;
    content_wpp.innerHTML = await response.text();

    // Primeira Linha
    div_informed = content_wpp.querySelector("#informed");
    div_who_informed = new DivEvents(content_wpp.querySelector("#div_who_informed"));

    // Segunda Linha
    replace = content_wpp.querySelector("#replace");
    car_substitute = content_wpp.querySelector("#car_substitute");
    
    // Terceira Linha
    div_directions = new DivEvents(content_wpp.querySelector("#div_directions"));

    // Quarta Linha
    div_event = new DivEvents(content_wpp.querySelector("#div_event"))

}

load_wpp();

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
    div_who_informed.active_events();

    // Segunda Linha
    replace.onclick = function(){
        replace.classList.toggle("active");
        if(replace.classList.contains("active")){
            car_substitute.disabled = false;
            car_substitute.focus();
            return;
        }
        car_substitute.disabled = true;
        // .focus()
    }

    // Terceira Linha
    div_directions.active_events();

    // Quarta Linha
    div_event.active_events();

}

document.querySelector("#close-wpp").onclick = function(_) {
    div_wpp.classList.remove("open");

    // Primeira linha
    div_informed.onclick = null;
    div_who_informed.remove_events();
    
    // Segunda Linha
    replace.onclick = null;

    // Terceira Linha
    div_directions.remove_events();

    // Quarta Linha
    div_event.remove_events();
}
