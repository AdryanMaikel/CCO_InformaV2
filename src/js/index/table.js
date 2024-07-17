const table = document.getElementById("table");

function update_cookie_width_columns(new_width_columns){
    document.cookie=`columns=${JSON.stringify(new_width_columns)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
};
function create_cookie_width_columns(){
    const widths = {_: 35,A: 90,B: 80,C: 55,D: 55,E: 92,F: 55,G: 70,H: 325,I: 250,J: 400,K: 80, sum: 0};
    update_cookie_width_columns(widths);
    return widths;
};

const width_columns = document.cookie.split(";").find(cookie=>cookie.trim().startsWith("columns="))
?JSON.parse(decodeURIComponent(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("columns=")).split("=")[1]))
:create_cookie_width_columns();

function sum_columns() {
    Object.entries(width_columns).forEach(([column, width]) => {
        document.documentElement.style.setProperty(`--${column}`, `${width}px`);
        width_columns.sum += width;
    });
}
sum_columns()

function adjust_width_table(width) {
    const _table = table.querySelector("table");
    if(!_table)return;
    _table.style.width = width <= width_columns.sum ? `100%` : `${width_columns.sum + 10}px`;
}

window.onresize = ({target}) => adjust_width_table(target.innerWidth);

let editing_row = {element: null, values: {}};
let div_actions_table = null;
let button_cancel_edit = null;
let button_submit_edit = null;

let old_table = "";
async function get_table() {
    if(!logged)return;
    var url = `/cco-informa/${operator.value}/${password.value}`;
    const response = await fetch(url, { method: "GET" });
    if(response.status != 200)return;
    const text = await response.text();
    if(old_messages == text)return;
    old_messages = text;
    table.innerHTML = text;
    div_actions_table = table.querySelector("#actions-table");
    button_cancel_edit = div_actions_table.querySelector("#cancel-edit");
    button_submit_edit = div_actions_table.querySelector("#submit-edit");
    console.log("Atualizando tabela...");

    adjust_width_table(window.innerWidth);
    const tbody = table.querySelector("tbody");
    tbody.scrollTop = tbody.scrollHeight;

    const trs = tbody.querySelectorAll("tr");
    trs.forEach(tr=>{tr.addEventListener("click", edit_row)});
}

function edit_row(event) {
    if(editing_row.element)return;
    const row = event.target;
    console.log(`editando ${row.id}`);
    editing_row.element = row;
    row.querySelectorAll("textarea").forEach(textarea=>{
        editing_row.values[textarea.id.slice(5)] = textarea.value;
    });
    row.classList.add("editing");

    div_actions_table.classList.add("open");
    button_cancel_edit.addEventListener("click", cancel_edit_row);
    button_submit_edit.addEventListener("click", submit_edit_row);
    
    console.log(editing_row.values);
}

function submit_edit_row() {
    if(!editing_row.element)return;
}

function cancel_edit_row() {
    if(!editing_row.element)return;
    editing_row.element.querySelectorAll("textarea").forEach(textarea=>{
        const value = editing_row.values[textarea.id.slice(5)];
        if(textarea.value != value)textarea.value = value;
    });
    editing_row.element.classList.remove("editing");
    editing_row = {element: null, values: {}};
    div_actions_table.classList.remove("open");
}