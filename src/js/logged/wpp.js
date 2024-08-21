const div_wpp = document.getElementById("wpp");
const content_wpp = div_wpp.querySelector(".content");

function reset_events() {
    label_event.div.classList.remove("revel");
    minutes.disabled = true;
    interrupted.disabled = true;
    continued.disabled = true;
    has_continued.onclick = null;
    if(!row_interrupted.classList.contains("h0"))
        row_interrupted.classList.add("h0");
    if(!row_continuation.classList.contains("h0"))
        row_continuation.classList.add("h0");
    toggle_has_continued.classList.remove("active");
    dropping_passengers.onclick = null;
    dropping_passengers.classList.add("hidden");
    toggle_dropping_passengers.classList.remove("active");
}

function reset_motives() {
    if(!row_hrs_gps.classList.contains("h0"))
        row_hrs_gps.classList.add("h0");
    gps_hours.forEach(input=>input.disabled = true);
    if(!row_gps.classList.contains("h0"))
        row_gps.classList.add("h0");
    radios_gps.forEach(input=>{input.disabled = true;input.onchange = null;});
    if(!row_congestion.classList.contains("h0"))
        row_congestion.classList.add("h0");
    congestion.disabled = true;
    if(!row_roullet_and_validator.classList.contains("h0"))
        row_roullet_and_validator.classList.add("h0");
    radios_roullet_and_validator.forEach(input=>input.disabled = true);
    if(!row_tripulation.classList.contains("h0"))
        row_tripulation.classList.add("h0");
    radios_tripulation.forEach(input=>input.disabled = true);
    if(!row_problem.classList.contains("h0"))
        row_problem.classList.add("h0");
    label_problem.input.disabled = true;

}

function reset_problems() {
    if(!row_limpador_espelho.classList.contains("h0"))
        row_limpador_espelho.classList.add("h0");
    radios_limpador_espelho.forEach(input=>input.disabled = true);
    if(!row_embreagem_caixa.classList.contains("h0"))
        row_embreagem_caixa.classList.add("h0");
    radios_embreagem_caixa.forEach(input=>input.disabled = true);
}

function check_event({ event }) {
    reset_events()
    switch (event) {
        case "adiantada":
        case "atrasada":
            label_event.div.classList.add("revel");
            minutes.disabled = false;
            setTimeout(()=>minutes.focus(), 150);
            toggle_has_continued.classList.remove("active")
            break;
        case "interrompida":
            if(row_interrupted.classList.contains("h0"))
                row_interrupted.classList.remove("h0");
            interrupted.disabled = false;
            setTimeout(()=>interrupted.focus(), 150);
            continued.disabled = true;
            has_continued.onclick = function() {
                toggle_has_continued.classList.toggle("active");
                if(toggle_has_continued.classList.contains("active")) {
                    row_continuation.classList.remove("h0");
                    dropping_passengers.classList.remove("hidden");
                    dropping_passengers.onclick = function() {
                        toggle_dropping_passengers.classList.toggle("active");
                    }
                    continued.disabled = false;
                    continued.focus();
                } else {
                    row_continuation.classList.add("h0");
                    dropping_passengers.onclick = null;
                    dropping_passengers.classList.add("hidden");
                    toggle_dropping_passengers.classList.remove("active");
                    continued.disabled = true;
                    interrupted.focus();
                }
            };
            break;
        case "realizada a frente":
            continued.disabled = false;
            row_continuation.classList.remove("h0");
            setTimeout(()=>continued.focus(), 150);
            break;
    }
}

function check_motive({ motive }) {
    reset_motives()
    switch (motive) {
        case "Adiantado com autorização":
        case "Adiantado sem autorização":
            label_event.input.value = "adiantada";
            label_event.tresh.classList.add("active");
            check_event({div: label_event.div, event: "adiantada"});
            break;
        case "Atrasado":
            label_event.input.value = "atrasada";
            label_event.tresh.classList.add("active");
            check_event({div: label_event.div, event: "atrasada"});
            break;
        case "Congestionamento":
            row_congestion.classList.remove("h0");
            congestion.disabled = false;
            setTimeout(()=>congestion.focus(), 150);
            break;
        case "Falta de Tripulação":
            row_tripulation.classList.remove("h0");
            radios_tripulation.forEach(input=>input.disabled = false);
            break;
        case "GPS com problemas de Comunicação":
            if(row_gps.classList.contains("h0"))
                row_gps.classList.remove("h0");
            if(radios_gps[0].checked){
                row_hrs_gps.classList.remove("h0");
                gps_hours.forEach(input=>input.disabled = false);
                setTimeout(()=>gps_hours[0].focus(), 150);
            }
            radios_gps.forEach(input=>{
                input.disabled = false;
                input.onchange = function() {
                    if(input.id == "parou"){
                        row_hrs_gps.classList.remove("h0");
                        gps_hours.forEach(input=>input.disabled = false);
                        setTimeout(()=>gps_hours[0].focus(), 150);
                    } else {
                        row_hrs_gps.classList.add("h0");
                        gps_hours.forEach(input=>input.disabled = true)
                    }
                }
            });
            break;
        case "Problemas mecânicos":
            row_problem.classList.remove("h0");
            label_problem.input.disabled = false;
            setTimeout(()=>label_problem.input.focus(), 150);
            break;
        case "Validador/ Roleta":
            row_roullet_and_validator.classList.remove("h0");
            radios_roullet_and_validator.forEach(input=>input.disabled = false);
            break;
    }
}

function check_problem({ problem }) {
    reset_problems()
    switch (problem) {
        case "Carroceria - Limpador / Espelho":
            if(row_limpador_espelho.classList.contains("h0"))
                row_limpador_espelho.classList.remove("h0");
            radios_limpador_espelho.forEach(input=>input.disabled = false);
            break;
        case "Suspensão - Embreagem / Caixa":
            if(row_embreagem_caixa.classList.contains("h0"))
                row_embreagem_caixa.classList.remove("h0");
            radios_embreagem_caixa.forEach(input=>input.disabled = false);
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
                    this.tresh.disabled = false;
                    const text_content = target.textContent;
                    this.input.value = text_content;
                    if(this.id_div === "label_event")
                        check_event({div: this.div, event: text_content});
                    if(this.id_div === "label_motive")
                        check_motive({motive: text_content});
                    if(this.id_div === "label_problem")
                        check_problem({problem: text_content})
                }
            });
        };

        this.tresh.onclick = (event) => {
            event.stopPropagation();
            this.input.value = "";
            this.tresh.classList.remove("active");
            this.tresh.disabled = true;

            if(this.id_div === "label_event")
                check_event({div: this.div, event: ""});
            if(this.id_div === "label_motive")
                check_motive({motive: ""});
            if(this.id_div === "label_problem")
                check_problem({problem: ""})
        };

        this.input.oninput = (event) => {
            if (this.input.value === "")
                return;
            this.tresh.classList.add("active");
            this.tresh.disabled = false;

            let elements = [];
            this.items.forEach(item => {
                if (!item.textContent.toLowerCase().includes(this.input.value.toLowerCase())) {
                    item.classList.add("h0");
                } else {
                    item.classList.remove("h0");
                    elements.push(item);
                }
            });
            if (elements.length == 1 && this.id_div != "label_who_informed") {
                const text_content = elements[0].textContent;
                this.input.value = text_content;
                event.target.blur();
                switch (this.id_div) {
                    case "label_event":
                        check_event({div: this.div, event: text_content});
                        break;
                    case "label_motive":
                        check_motive({motive: text_content});
                        break;
                    case "label_problem":
                        check_problem({problem: text_content});
                    default:
                        break;
                }
            }
        };

        this.input.onblur = () => {
            if (this.input.value === "" && this.tresh.classList.contains("active")) {
                this.tresh.classList.remove("active");
                this.tresh.disabled = true;

                if(this.id_div === "label_event")
                    check_event({div: this.div, event: ""});
                if(this.id_div === "label_motive")
                    check_motive({motive: ""});
                if(this.id_div === "label_problem")
                    check_problem({problem: ""})
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

let informed, label_who_informed = null;
let replace, car_substitute, directions = null;
let label_event, minutes = null;
let row_interrupted, interrupted = null;
let has_continued, row_continuation, continued = null;
let dropping_passengers = null;
let toggle_has_continued, toggle_dropping_passengers = null;

let label_motive = null;
let row_gps, row_hrs_gps = null;
let radios_gps, gps_hours = [];
let row_congestion, congestion = null;
let row_roullet_and_validator = null;
let radios_roullet_and_validator = [];
let row_tripulation = null;
let radios_tripulation = []

let row_problem, label_problem, problem = null;
let row_limpador_espelho, row_embreagem_caixa = null;
let radios_limpador_espelho, radios_embreagem_caixa = [];


async function load_wpp(){
    const response = await fetch(`/wpp/${operator.value}/${password.value}`)
    if(response.status != 200)return;
    content_wpp.innerHTML = await response.text();

    informed = content_wpp.querySelector("#informed");
    label_who_informed = new DivEvents(content_wpp.querySelector("#label_who_informed"));

    replace = content_wpp.querySelector("#replace");
    car_substitute = content_wpp.querySelector("#car_substitute");

    directions = new DivEvents(content_wpp.querySelector("#directions"));

    label_event = new DivEvents(content_wpp.querySelector("#label_event"));
    minutes = content_wpp.querySelector("#minutes");
    row_interrupted = content_wpp.querySelector("#row_interrupted");
    interrupted = row_interrupted.querySelector("input");
    has_continued = content_wpp.querySelector("#has_continued");
    row_continuation = content_wpp.querySelector("#row_continuation");
    continued = row_continuation.querySelector("input");
    dropping_passengers = content_wpp.querySelector("#dropping_passengers");
    toggle_has_continued = has_continued.querySelector(".toggle");
    toggle_dropping_passengers = dropping_passengers.querySelector(".toggle");

    label_motive = new DivEvents(content_wpp.querySelector("#label_motive"));
    row_gps = content_wpp.querySelector("#row_gps");
    radios_gps = row_gps.querySelectorAll(`input[name="gps"]`);
    radios_gps.forEach(input=>input.onclick = event=>event.stopPropagation())
    row_hrs_gps = content_wpp.querySelector("#row_hrs_gps");
    gps_hours = row_hrs_gps.querySelectorAll("input");
    row_congestion = content_wpp.querySelector("#row_congestion");
    congestion = row_congestion.querySelector("input");
    row_roullet_and_validator = content_wpp.querySelector("#row_roullet_and_validator");
    radios_roullet_and_validator = row_roullet_and_validator.querySelectorAll("input");
    row_tripulation = content_wpp.querySelector("#row_tripulation");
    radios_tripulation = row_tripulation.querySelectorAll("input");

    row_problem = content_wpp.querySelector("#row_problem");
    label_problem =  new DivEvents(row_problem.querySelector("#label_problem"));

    row_limpador_espelho = content_wpp.querySelector("#row_limpador_espelho");
    radios_limpador_espelho = row_limpador_espelho.querySelectorAll("input");
    row_embreagem_caixa = content_wpp.querySelector("#row_embreagem_caixa");
    radios_embreagem_caixa = row_embreagem_caixa.querySelectorAll("input");
}

load_wpp();

document.querySelector("#open-wpp").onclick = function() {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
    div_wpp.classList.add("open");
    let toggle_informed = informed.querySelector(".toggle");
    informed.onclick = function() {
        if(!toggle_informed)return;
        toggle_informed.classList.toggle("active");
    };
    label_who_informed.active_events();
    replace.onclick = function(){
        replace.classList.toggle("active");
        if(replace.classList.contains("active")){
            car_substitute.disabled = false;
            car_substitute.focus();
            return;
        }
        car_substitute.disabled = true;
    }
    directions.active_events();
    label_event.active_events();
    label_motive.active_events();
    label_problem.active_events();

}

document.querySelector("#close-wpp").onclick = function() {
    div_wpp.classList.remove("open");
    informed.onclick = null;
    label_who_informed.remove_events();
    replace.onclick = null;
    directions.remove_events();
    label_event.remove_events();
    label_motive.remove_events();
    label_problem.remove_events();
}
