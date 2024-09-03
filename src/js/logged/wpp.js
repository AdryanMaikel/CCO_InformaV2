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
    radios_validator_and_roullet.forEach(input=>input.disabled = true);
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
            radios_validator_and_roullet.forEach(input=>input.disabled = false);
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
        case "Problemas na viagem anterior":
            input_car.value = car_substitute.value;
            car_substitute.value = "";
            if (replace.classList.contains("active"))
                replace.classList.remove("active");
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
            if(this.div.classList.contains("open")) {
                event.target.blur();
                return;
            }
            this.div.classList.add("open");
            this.items.forEach(item => {
                if(item.classList.contains("h0"))
                    item.classList.remove("h0");
                item.onclick = ({target}) => {
                    if(!this.tresh.classList.contains("active"))
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
            this.input.value = this.input.value.replace(/[^a-zA-Z]/, "");
            if(this.id_div == "directions")
                this.input.value = this.input.value.toUpperCase();

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

let informed, toggle_informed, label_who_informed = null;

let input_table, input_car, replace, car_substitute = null;

let input_line, input_hour, directions = null;

let label_event, minutes = null;
let row_interrupted, interrupted = null;
let has_continued, row_continuation, continued, dropping_passengers = null;
let toggle_has_continued, toggle_dropping_passengers = null;

let label_motive = null;
let row_gps, row_hrs_gps = null;
let radios_gps, gps_hours = [];
let row_congestion, congestion = null;
let row_roullet_and_validator = null;
let radios_validator_and_roullet = [];
let row_tripulation = null;
let radios_tripulation = []

let row_problem, label_problem, problem = null;
let row_limpador_espelho, row_embreagem_caixa = null;
let radios_limpador_espelho, radios_embreagem_caixa = [];

let button_generate = null;
let informations_generated = null;
let problema_viagem_anterior = "";


async function load_wpp(){
    const response = await fetch(`/wpp/${operator.value}/${password.value}`)
    if(response.status != 200)return;
    content_wpp.innerHTML = await response.text();

    informed = content_wpp.querySelector("#informed");
    toggle_informed = informed.querySelector(".toggle");
    label_who_informed = new DivEvents(content_wpp.querySelector("#label_who_informed"));

    input_table = content_wpp.querySelector("#table");
    input_car = content_wpp.querySelector("#car");
    replace = content_wpp.querySelector("#replace");
    car_substitute = content_wpp.querySelector("#car_substitute");

    input_line = content_wpp.querySelector("#line");
    input_hour = content_wpp.querySelector("#hour");
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
    radios_validator_and_roullet = row_roullet_and_validator.querySelectorAll("input");
    row_tripulation = content_wpp.querySelector("#row_tripulation");
    radios_tripulation = row_tripulation.querySelectorAll("input");

    row_problem = content_wpp.querySelector("#row_problem");
    label_problem =  new DivEvents(row_problem.querySelector("#label_problem"));

    row_limpador_espelho = content_wpp.querySelector("#row_limpador_espelho");
    radios_limpador_espelho = row_limpador_espelho.querySelectorAll("input");
    row_embreagem_caixa = content_wpp.querySelector("#row_embreagem_caixa");
    radios_embreagem_caixa = row_embreagem_caixa.querySelectorAll("input");

    button_generate = content_wpp.querySelector("#generate-cco-informa");
    informations_generated = content_wpp.querySelector("#informations-generated");

    content_wpp.querySelectorAll("input.car").forEach(
        input=>input.oninput = function() {
            this.value = this.value.replace(/[^0-9]/, "");
            if(this.value.length == 4){
                if(this.id == "car" && replace.classList.contains("active")){
                    return car_substitute.focus();
                }
                return input_line.focus();
            }
        }
    );
    [input_table, input_line].forEach(
        input=>input.oninput = function() {
            this.value = this.value.replace(/[^a-zA-Z0-9]/, "").toUpperCase();
        }
    );
    input_hour.oninput = function({inputType}) {
        this.value = this.value.replace(/[^0-9:]/, "");
        if(input_hour.value.length == 2 && inputType != "deleteContentBackward")
            return this.value += ":"
        if(input_hour.value.length == 5){
            if(directions.input.value == "")
                return directions.input.focus();
            else
                return label_event.input.focus();
        }
    }
    input_table.onblur = function () {
        if(this.value.indexOf("/") >= 1 || this.value.length < 3)return;
        var value = this.value.split("");
        this.value = `${value.slice(0, this.value.length - 3).join("")}/${value.slice(this.value.length - 3, this.value.length + 1).join("")}`;
        if(input_line.value == "") {
            var _line = this.value.split("/")[0]
            if(_line == "661"){
                input_line.value = "761";
            } else if(_line == "662"){
                input_line.value = "762";
            } else {
                input_line.value = _line;
            }
            autocomplete_direction()
            if(input_car.value == ""){
                return input_car.focus();
            }
        }

    }
    input_line.onblur = function() {
        autocomplete_direction();
    }
}

load_wpp();

document.querySelector("#open-wpp").onclick = function() {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open"))
        return;
    div_wpp.classList.add("open");
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

    button_generate.onclick = generate_cco_informa;
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

    button_generate.onclick = null;
}

function get_full_date() {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

function get_who_informed() {
    const was_informed = toggle_informed.classList.contains("active")
    ? "Conforme informado ao CCO pelo"
    : "Conforme contato feito pelo CCO ao"
    const name = label_who_informed.input.value;
    const informed_by = ["Navegantes", "Nortran", "Sopal"].includes(name)
    ? `largador da ${name}`
    : `fiscal ${name}`;
    return `${was_informed} ${informed_by}`
}

function process_event() {
    let _event = "Viagem ";
    let _ocorrencia = "";
    switch (label_event.input.value) {
        case "adiantada":
            _event += `realizada com ${minutes.value} minutos antes do horário previsto,`;
            _ocorrencia = "Problemas mecânicos";
            break;
        case "atrasada":
            _event += `realizada com ${minutes.value} minutos de atraso`;
            _ocorrencia = "Problemas mecânicos - Atrasado";
            break;
        case "perdida":
            _event += "não realizada";
            _ocorrencia = "Problemas mecânicos - Viagem perdida";
            break;
        case "realizada a frente":
            _event += `realizada a partir d${continued.value}`;
            _ocorrencia = "Problemas mecânicos - Viagem realizada a frente";
            break;
        case "interrompida":
            _event += `interrompida n${interrupted.value}`;
            _ocorrencia = "Problemas mecânicos - Viagem interrompida";
            break;
    }
    return [ _ocorrencia, _event ];
}

function process_motive(_event) {
    let _motive = "";
    switch (label_motive.input.value) {
        case "Acidente":
            _motive += `Carro ${input_car.value} ter se envolvido em um acidente`;
            break;
        case "Adiantado com autorização":
            let name = label_who_informed.input.value;
            let informed_by = ["Navegantes", "Nortran", "Sopal"].includes(name)
            ? `largador da ${name}`
            : `fiscal ${name}`;
            _event += ` autorizado pelo ${informed_by}.`
            break
        case "Adiantado sem autorização":
            _event += ` sem autorização da fiscalização.`
            break
        case "Assalto":
            _motive += `Carro ${input_car.value} ter sido assaltado`;
            break;
        case "Atrasado":
            _motive += "Atraso";
            break;
        case "Avaria":
            _motive += `Carro ${input_car.value} ter sofrido avaria`;
            break;
        case "Congestionamento":
            if (congestion.value.length > 0)
                _motive += `Congestionamento n${congestion.value}`;
            else
                congestion.focus();
            break;
        case "Falta de Carro":
            _motive += "Falta de carro";
            break;
        case "Falta de Tripulação":
            let motorista = radios_tripulation[0];
            _motive += "Falta de " + String(motorista.checked ? "motorista" : "cobrador");
            break;
        case "Pneu Furado":
            _motive += "Pneu furado do carro "+input_car.value;
            break;
        case "Problema com passageiro":
            _motive += "problema com passageiro";
            break;
        case "Tempo insuficiente":
            _motive += "tempo insuficiente para realizar viagem";
            break;
        case "Validador/ Roleta":
            let roullet = radios_validator_and_roullet[0];
            _motive += "Problemas n" + String(roullet.checked ? "o validador" : "a roleta");
            _motive += ` do carro ${input_car.value}`;
            break;
        case "Vandalismo":
            _motive += `Carro ${input_car.value} ter sofrido vandalismo`.
            break;
        case "Vistoria EPTC":
            _motive += "Vistoria da EPTC";
            break;
        case "Problemas mecânicos":
            switch (label_problem.input.value) {
                case "Carroceria - Ar Condicionado":
                    _motive += `Problemas no ar-condicionado do carro ${input_car.value}`;
                    break;
                case "Carroceria - Elevador APD":
                    _motive += `Problemas no elevador APD do carro ${input_car.value}`;
                    break;
                case "Carroceria - Itens de segurança":
                    _motive += "";
                    break;
                case "Carroceria - Limpador / Espelho":
                    let limpador = radios_limpador_espelho[0];
                    _motive += limpador.checked ? "Problemas no limpador" : "Queda do espelho";
                    _motive += ` do carro ${input_car.value}`;
                    break;
                case "Carroceria - Outros":
                    _motive += "";
                    break;
                case "Carroceria - Portas":
                    _motive += `Problemas nas portas do carro ${input_car.value}`;
                    break;
                case "Elétrica - Alternador":
                    _motive += `Problemas no alternador do carro ${input_car.value}`;
                    break;
                case "Elétrica - Iluminação interna":
                    _motive += `Problemas de iluminação interna no carro ${input_car.value}`;
                    break;
                case "Elétrica - Letreiro":
                    _motive += `Problemas no letreiro do carro ${input_car.value}`;
                    break;
                case "Elétrica - Pane elétrica":
                    _motive += `Pane elétrica do carro ${input_car.value}`;
                    break;
                case "Elétrica - Sem arranque":
                    _motive += `Carro ${input_car.value} não pegar`;
                    break;
                case "Motor - Cigarra/Aquecimento":
                    _motive += `Carro ${input_car.value} ter super aquecido`;
                    break;
                case "Motor - Cigarra/óleo motor":
                    _motive += `Carro ${input_car.value} ter super aquecido`;
                    break;
                case "Motor - Correias":
                    _motive += `Problemas nas correias do motor do carro ${input_car.value}`;
                    break;
                case "Motor - Sem Força":
                    _motive += `Carro ${input_car.value} estar sem força`;
                    break;
                case "Motor - Vazamento de água":
                    _motive += `Vazamento de água no carro ${input_car.value}`;
                    break;
                case "Motor - Vazamento de óleo Diesel":
                    _motive += `Vazamento de diesel no carro ${input_car.value}`;
                    break;
                case "Motor - Vazamento de óleo motor":
                    _motive += `Vazamento de óleo do motor no carro ${input_car.value}`;
                    break;
                case "Problemas na viagem anterior":
                    _motive = problema_viagem_anterior;
                    break;
                case "Suspensão - Arriada":
                    _motive += `Problemas na suspensão do carro ${input_car.value}`;
                    break;
                case "Suspensão - Carro atravessado":
                    _motive += `Carro ${input_car.value} estar atravessado`;
                    break;
                case "Suspensão - Embreagem / Caixa":
                    let embreagem = radios_embreagem_caixa[0];
                    _motive += "Problemas na " + String(embreagem.checked ? "embreagem" : "caixa das marchas");
                    _motive += ` do carro ${input_car.value}`;
                break;
                case "Suspensão - Freio":
                    _motive += `Problemas nos freios do carro ${input_car.value}`;
                    break;
                case "Suspensão - Roda":
                    _motive += `Problemas nas rodas do carro ${input_car.value}`;
                    break;
                case "Suspensão - Vazamento de ar":
                    _motive += `Vazamento de ar no carro ${input_car.value}`;
                    break;
            }
            break;
  }

  if (problema_viagem_anterior != _motive)
    problema_viagem_anterior = `${_motive} na viagem anterior`;

  if (replace.classList.contains("active"))
    _motive += `, trocado pelo carro ${car_substitute.value}`;

  let continued_text = "";
  if (toggle_has_continued.classList.contains("active")) {
        if (continued.value.length > 0) {
            continued_text += String(car_substitute.disabled ? " e " : " que ");
            continued_text += `continuou puxando viagem a partir d${continued.value}`;
            if (toggle_dropping_passengers.classList.contains("active"))
                continued_text += " somente largando os passageiros";
            _motive += continued_text;
        } else {
            continued.focus();
        }
    }
  return [ _motive, _event ]
}

function generate_cco_informa() {
    let [_ocorrencia, _event]  = process_event()
    let _motive = "";
    [_motive, _event] = process_motive(_event);

    let cco_informa = `\
*CCO INFORMA*
${get_who_informed()}
- ${input_table.value}, carro ${input_car.value}
- ${input_line.value} das ${input_hour.value}, ${directions.input.value}
- ${_event}
- Motivo: ${_motive}`;

    if(label_event.input.value == "adiantada")
        cco_informa = cco_informa.replace("\n- Motivo: ", "");

    const _json = {}
    if (last_row) {
        _json.B = input_table.value;
        _json.C = input_line.value;
        _json.D = input_car.value;
        _json.E = String(!car_substitute.disabled ? car_substitute.value : "");
        _json.F = input_hour.value;
        _json.G = directions.input.value;
        if (label_motive.input.value == "Problemas mecânicos") {
            _json.H =  _ocorrencia;
            _json.I = label_problem.input.value;
        } else {
            _json.H = label_motive.input.value;
            _json.I = "";
        }
        if(label_event.input.value == "adiantada")
            _json.J = `${_event}`;
        else
            _json.J = `${_event} devido a ${_motive.charAt(0).toLowerCase()}${_motive.slice(1)}`;
        _json.K = operator.value;
    }

    console.log(`Gerou:\ncco informa:\n${cco_informa}\njson:\n${JSON.stringify(_json)}`);

    informations_generated.innerHTML = `\
<div class="row cco-informa" information_id="" data='${encodeURIComponent(JSON.stringify(_json))}'>
    <textarea>${cco_informa}</textarea>
    <div class="col center">
        <button class="copy" onclick="copy_cco_informa(event)"><i class="fa-solid fa-copy"></i></button>
        <button class="send" onclick="insert_to_table(event)"><i class="fa-solid fa-paper-plane"></i></button>
        <button class="remove" onclick="remove_cco_informa(event)"><i class="fa-solid fa-trash-can"></i></button>
        <button class="favorite" onclick="favorite_cco_informa(event)"><i class="fa-regular fa-star"></i></button>
    </div>
</div>
${informations_generated.innerHTML}
`
}


function copy_cco_informa(event) {
    const text_to_copy = event.target.closest(".cco-informa").querySelector("textarea").value;
    navigator.clipboard.writeText(text_to_copy).then(() => {
        console.log("Texto copiado!");
    }).catch(error => {
        console.error('Erro ao copiar texto: ', error);
    });
}

function remove_cco_informa(event) {
    const element = event.target.closest(".cco-informa");
    const _id = element.getAttribute("information_id");
    element.remove();
    if(_id) console.log("removendo cco-informa: ", _id);
}

async function insert_to_table(event) {
    await check_table();
    const element = event.target.closest(".cco-informa");
    const _json = JSON.parse(decodeURIComponent(element.getAttribute("data")));
    _json.row = parseInt(last_row.getAttribute("row"));
    _json.A = get_full_date();
    if(_json.G == "BC"){
        _json.G = "1"
    }
    if(_json.G == "CB"){
        _json.G = "2"
    }
    overlay.classList.remove("w0");
    const response = await request("table", "POST", _json);
    if (!response) return;
    await check_table();
    // setTimeout(()=>overlay.classList.add("w0"), 500)
}

async function favorite_cco_informa(event) {
    const button = event.target;  
    const element = button.closest(".cco-informa");
    const i = button.querySelector("i");
    if(i.classList.contains("fa-regular")) {
        let json = {
            information: element.querySelector("textarea").value,
            data: decodeURIComponent(element.getAttribute("data"))
        };
        const response = await request("informations", "POST", json, true);
        if (response) {
            element.setAttribute("information_id", response);
            i.classList.replace("fa-regular", "fa-solid");
        }
    } else {
        let json = { id: element.getAttribute("information_id") };
        const response = await request("informations", "DELETE", json);
        if (response) {
            element.setAttribute("information_id", "");
            i.classList.replace("fa-solid", "fa-regular");
        }
    }
}

function autocomplete_direction() {
    if(input_line.value == "B02"
    || input_line.value == "B25"
    || input_line.value == "B51"
    || input_line.value == "B55"
    || input_line.value == "B56"){
        directions.input.value = "BB"
    }else
    if(input_line.value == "B09"
    || input_line.value == "A53"
    || input_line.value == "A63"
    || input_line.value == "A60"){
        directions.input.value = "TT"
    }else
    if(input_line.value == "6612"
    || input_line.value == "7612"
    || input_line.value == "8612"
    || input_line.value == "855"){
        directions.input.value = "CB"
    }else
    if(input_line.value == "605"
    || input_line.value == "617"
    || input_line.value == "650"
    || input_line.value == "653"
    || input_line.value == "7052"
    || input_line.value == "7053"){
        directions.input.value = "CC"
    }else
    if(input_line.value == "A631"
    || input_line.value == "A21"
    || input_line.value == "A24"
    || input_line.value == "A27"
    || input_line.value == "A31"
    || input_line.value == "A33"){
        directions.input.value = "BT"
    }else
    if(input_line.value == "A632"){
        directions.input.value = "TB"
    }else{
        // direction.value = ""
    }
    if(directions.input.value != ""
    && !directions.tresh.classList.contains("active")) {
        directions.tresh.classList.add("active");
        directions.tresh.disabled = false;
    }
    if(input_hour.value == "")
        return input_hour.focus();
    else if(directions.input.value == "")
        return directions.input.focus();
    return label_event.input.focus();
}