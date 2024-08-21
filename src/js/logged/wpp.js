const div_wpp = document.getElementById("wpp");
const content_wpp = div_wpp.querySelector(".content");

function check_event({div, event}) {
    const _input_interrupted = div_interrupted.querySelector("input");
    const _input_continued = div_continuation.querySelector("input");
    const toggle_has_continued = div_has_continued.querySelector(".toggle");
    const toggle_dropping_passengers = dropping_passengers.querySelector(".toggle");
    switch (event) {
        case "adiantada":
        case "atrasada":
            div.classList.add("revel");
            minutes.disabled = false;
            setTimeout(()=>minutes.focus(), 150);
            if(!div_interrupted.classList.contains("h0"))
                div_interrupted.classList.add("h0");
            _input_interrupted.disabled = true;
            _input_continued.disabled = true;
            div_has_continued.onclick = null;
            div_continuation.classList.add("h0");
            toggle_has_continued.classList.remove("active")
            dropping_passengers.onclick = null;
            dropping_passengers.classList.add("hidden");
            toggle_dropping_passengers.classList.remove("active");
            break;
        case "interrompida":
            div.classList.remove("revel");
            minutes.disabled = true;
            if(div_interrupted.classList.contains("h0"))
                div_interrupted.classList.remove("h0");
            if(!div_interrupted.classList.contains("h0"))
                div_continuation.classList.add("h0");
            _input_interrupted.disabled = false;
            setTimeout(()=>_input_interrupted.focus(), 150);
            _input_continued.disabled = true;
            dropping_passengers.onclick = null;
            dropping_passengers.classList.add("hidden");
            toggle_dropping_passengers.classList.remove("active");
            div_has_continued.onclick = function() {
                toggle_has_continued.classList.toggle("active");
                if(toggle_has_continued.classList.contains("active")) {
                    div_continuation.classList.remove("h0");
                    dropping_passengers.classList.remove("hidden");
                    dropping_passengers.onclick = function() {
                        toggle_dropping_passengers.classList.toggle("active");
                    }
                    _input_continued.disabled = false;
                    _input_continued.focus();
                } else {
                    div_continuation.classList.add("h0");
                    dropping_passengers.onclick = null;
                    dropping_passengers.classList.add("hidden");
                    toggle_dropping_passengers.classList.remove("active");
                    _input_continued.disabled = true;
                    _input_interrupted.focus();
                }
            };
            break;
        case "realizada a frente":
            div.classList.remove("revel");
            minutes.disabled = true;
            _input_interrupted.disabled = true;
            _input_continued.disabled = false;
            div_has_continued.onclick = null;
            if(!div_interrupted.classList.contains("h0"))
                div_interrupted.classList.add("h0");
            div_continuation.classList.remove("h0");
            toggle_has_continued.classList.remove("active");
            dropping_passengers.onclick = null;
            dropping_passengers.classList.add("hidden");
            toggle_dropping_passengers.classList.remove("active");
            setTimeout(()=>_input_continued.focus(), 150);
            break;
        default:
            div.classList.remove("revel");
            minutes.disabled = true;
            _input_interrupted.disabled = true;
            _input_continued.disabled = true;
            div_has_continued.onclick = null;
            if(!div_interrupted.classList.contains("h0"))
                div_interrupted.classList.add("h0");
            if(!div_continuation.classList.contains("h0"))
                div_continuation.classList.add("h0");
            toggle_has_continued.classList.remove("active");
            dropping_passengers.onclick = null;
            dropping_passengers.classList.add("hidden");
            toggle_dropping_passengers.classList.remove("active");
            break;
    }
}

function check_motive({div, motive}) {
    if(!div_hrs_gps.classList.contains("h0"))
        div_hrs_gps.classList.add("h0");
    gps_hours.forEach(input=>input.disabled = true);
    if(!div_gps.classList.contains("h0"))
        div_gps.classList.add("h0");
    radios_gps.forEach(input=>{input.disabled = true;input.onchange = null;});
    div_congestion.classList.add("h0");
    congestion.disabled = true;
    div_roullet_and_validator.classList.add("h0");
    radios_roullet_and_validator.forEach(input=>input.disabled = true);
    div_tripulation.classList.add("h0");
    radios_tripulation.forEach(input=>input.disabled = true);

    switch (motive) {
        case "Adiantado com autorização":
        case "Adiantado sem autorização":
            if(!div_hrs_gps.classList.contains("h0"))
                div_hrs_gps.classList.add("h0");
            gps_hours.forEach(input=>input.disabled = true);
            if(!div_gps.classList.contains("h0"))
                div_gps.classList.add("h0");
            radios_gps.forEach(input=>{input.disabled = true;input.onchange = null;});
        
            div_event.input.value = "adiantada";
            div_event.tresh.classList.add("active");
            check_event({div: div_event.div, event: "adiantada"});
            break;
        case "Atrasado":
            if(!div_hrs_gps.classList.contains("h0"))
                div_hrs_gps.classList.add("h0");
            gps_hours.forEach(input=>input.disabled = true);
            if(!div_gps.classList.contains("h0"))
                div_gps.classList.add("h0");
            radios_gps.forEach(input=>{input.disabled = true;input.onchange = null;});

            div_event.input.value = "atrasada";
            div_event.tresh.classList.add("active");
            check_event({div: div_event.div, event: "atrasada"});
            break;
        case "Congestionamento":
            if(!div_hrs_gps.classList.contains("h0"))
                div_hrs_gps.classList.add("h0");
            gps_hours.forEach(input=>input.disabled = true);
            if(!div_gps.classList.contains("h0"))
                div_gps.classList.add("h0");
            radios_gps.forEach(input=>{input.disabled = true;input.onchange = null;});

            div_congestion.classList.remove("h0");
            congestion.disabled = false;
            setTimeout(()=>congestion.focus(), 150);
            break;
        case "Falta de Tripulação":
            div_tripulation.classList.remove("h0");
            radios_tripulation.forEach(input=>input.disabled = false);
            break;
        case "GPS com problemas de Comunicação":
            if(div_gps.classList.contains("h0"))
                div_gps.classList.remove("h0");
            if(radios_gps[0].checked){
                div_hrs_gps.classList.remove("h0");
                gps_hours.forEach(input=>input.disabled = false);
                setTimeout(()=>gps_hours[0].focus(), 150);
            }
            radios_gps.forEach(input=>{
                input.disabled = false;
                input.onchange = function() {
                    if(input.id == "parou"){
                        div_hrs_gps.classList.remove("h0");
                        gps_hours.forEach(input=>input.disabled = false);
                        setTimeout(()=>gps_hours[0].focus(), 150);
                    } else {
                        div_hrs_gps.classList.add("h0");
                        gps_hours.forEach(input=>input.disabled = true)
                    }
                }
            });
            break;
        case "Validador/ Roleta":
            div_roullet_and_validator.classList.remove("h0");
            radios_roullet_and_validator.forEach(input=>input.disabled = false);
            break;
        default:
            if(!div_hrs_gps.classList.contains("h0"))
                div_hrs_gps.classList.add("h0");
            gps_hours.forEach(input=>input.disabled = true);
            if(!div_gps.classList.contains("h0"))
                div_gps.classList.add("h0");
            radios_gps.forEach(input=>{input.disabled = true;input.onchange = null;});
        
            break;
    }
}

class DivEvents {
    constructor(div) {
        this.div = div;
        this.id_div = this.div.id;
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
            this.items.forEach(item => {
                if (item.classList.contains("h0"))
                    item.classList.remove("h0");
                item.onclick = ({target}) => {
                    if (!this.tresh.classList.contains("active"))
                        this.tresh.classList.add("active");
                    const text_content = target.textContent;
                    this.input.value = text_content;
                    if(this.id_div === "div_event")
                        check_event({div: this.div, event: text_content});
                    if(this.id_div === "div_motive")
                        check_motive({div: this.div, motive: text_content});
                }
            });
        };

        this.tresh.onclick = (event) => {
            event.stopPropagation();
            this.input.value = "";
            this.tresh.classList.remove("active");

            if(this.id_div === "div_event")
                check_event({div: this.div, event: ""});
            if(this.id_div === "div_motive")
                check_motive({div: this.div, motive: ""});
        };

        this.input.oninput = (event) => {
            if (this.input.value === "")
                return;
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
            if (elements.length == 1 && this.id_div != "div_who_informed") {
                const text_content = elements[0].textContent;
                this.input.value = text_content;
                event.target.blur();
                switch (this.id_div) {
                    case "div_event":
                        check_event({div: this.div, event: text_content});
                        break;
                    case "div_motive":
                        check_motive({div: this.div, motive: text_content});
                    default:
                        break;
                }
            }
        };

        this.input.onblur = () => {
            if (this.input.value === "" && this.tresh.classList.contains("active")) {
                this.tresh.classList.remove("active");
                if(this.id_div === "div_event")
                    check_event({div: this.div, event: ""});
                if(this.id_div === "div_motive")
                    check_motive({div: this.div, motive: ""});
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

let div_informed, div_who_informed = null;
let replace, car_substitute, div_directions = null;
let div_event, minutes, div_interrupted, div_has_continued, div_continuation = null;
let dropping_passengers = null;

let div_motive = null;
let div_gps, div_hrs_gps = null;
let radios_gps, gps_hours = [];
let div_congestion, congestion = null;
let div_roullet_and_validator = null;
let radios_roullet_and_validator = [];
let div_tripulation = null;
let radios_tripulation = []
let x = null;

async function load_wpp(){
    const response = await fetch(`/wpp/${operator.value}/${password.value}`)
    if(response.status != 200)return;
    content_wpp.innerHTML = await response.text();

    // Primeira Linha
    div_informed = content_wpp.querySelector("#div_informed");
    div_who_informed = new DivEvents(content_wpp.querySelector("#div_who_informed"));

    // Segunda Linha
    replace = content_wpp.querySelector("#replace");
    car_substitute = content_wpp.querySelector("#car_substitute");
    
    // Terceira Linha
    div_directions = new DivEvents(content_wpp.querySelector("#div_directions"));

    // Quarta Linha
    div_event = new DivEvents(content_wpp.querySelector("#div_event"));
    minutes = content_wpp.querySelector("#minutes");
    div_interrupted = content_wpp.querySelector("#div_interrupted");
    div_has_continued = content_wpp.querySelector("#div_has_continued");
    div_continuation = content_wpp.querySelector("#div_continuation");
    dropping_passengers = content_wpp.querySelector("#dropping_passengers");

    div_motive = new DivEvents(content_wpp.querySelector("#div_motive"));
    div_gps = content_wpp.querySelector("#div_gps");
    radios_gps = div_gps.querySelectorAll(`input[name="gps"]`);
    radios_gps.forEach(input=>input.onclick = event=>event.stopPropagation())
    div_hrs_gps = content_wpp.querySelector("#div_hrs_gps");
    gps_hours = div_hrs_gps.querySelectorAll("input");
    div_congestion = content_wpp.querySelector("#div_congestion");
    congestion = div_congestion.querySelector("input");
    div_roullet_and_validator = content_wpp.querySelector("#div_roullet_and_validator");
    radios_roullet_and_validator = div_roullet_and_validator.querySelectorAll("input");
    div_tripulation = content_wpp.querySelector("#div_tripulation");
    radios_tripulation = div_tripulation.querySelectorAll("input");
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
    div_directions.active_events();
    div_event.active_events();
    div_motive.active_events();

}

document.querySelector("#close-wpp").onclick = function(_) {
    div_wpp.classList.remove("open");

    div_informed.onclick = null;
    div_who_informed.remove_events();

    replace.onclick = null;
    div_directions.remove_events();
    div_event.remove_events();
    div_motive.remove_events();
}
