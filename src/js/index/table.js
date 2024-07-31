const table = document.getElementById("table");

function update_cookie_width_columns(new_width_columns){
    document.cookie=`columns=${JSON.stringify(new_width_columns)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
};

function sum_columns(columns_widths) {
    Object.entries(columns_widths).forEach(([column, width]) => {
        document.documentElement.style.setProperty(`--${column}`, `${width}px`);
        columns_widths.sum += width;
    });
    console.log(columns_widths.sum)
    document.documentElement.style.setProperty(`--sum`, `${columns_widths.sum}px`);
}

function create_cookie_width_columns() {
    const widths = {_: 35,A: 90,B: 80,C: 55,D: 55,E: 92,F: 55,G: 70,H: 325,I: 250,J: 400,K: 80, sum: 0};
    sum_columns(widths);
    update_cookie_width_columns(widths);
    return widths;
}

function load_cookie_width_columns() {
    const _cookie = JSON.parse(decodeURIComponent(document.cookie.split(";").find(
        cookie=>cookie.trim().startsWith("columns=")).split("=")[1]));
    sum_columns(_cookie);
    return _cookie;
}

const width_columns = document.cookie.split(";").find(cookie=>cookie.trim().startsWith("columns="))
?load_cookie_width_columns():create_cookie_width_columns();

function adjust_width_table(width) {
    const _table = table.querySelector("table");
    if(!_table)return;
    width_columns.sum = 0;
    sum_columns(width_columns);
    _table.style.width = width <= width_columns.sum ? `100%` : `${width_columns.sum + 12}px`;
}

let editing_row = {element: null, values: {}, method: null};

let div_actions_table = null;
let button_cancel_edit = null;
let button_submit_edit = null;
let button_delete_row = null;
let button_add_row = null;
let input_number_row = null;
let last_row = null;


let old_table = "";
async function get_table() {
    if(!logged||editing_row.element)return;
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
    button_delete_row = div_actions_table.querySelector("#delete-row");
    button_add_row = table.querySelector("#button-add-row");
    input_number_row = table.querySelector("#number-row");
    button_add_row.addEventListener("click", add_row);
    
    console.log("Atualizando tabela...");
    adjust_width_table(window.innerWidth);

    table.querySelectorAll("button.resize").forEach(button=>{
        button.addEventListener("mousedown", resizing_column);
    });

    const tbody = table.querySelector("tbody");
    tbody.scrollTop = tbody.scrollHeight;
    const rows = tbody.querySelectorAll("tr");
    rows.forEach(tr=>{
        if(tr.classList.contains("last-row")){last_row = tr;return};
        tr.addEventListener("click", edit_row);
    });
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
    editing_row.method = "editing";
    button_add_row.disabled = true;
    div_actions_table.classList.add("open");
    button_submit_edit.disabled = false;
    button_cancel_edit.addEventListener("click", cancel_edit_row);
    button_submit_edit.addEventListener("click", submit_edit_row);
    button_delete_row.addEventListener("click", remove_row);

    console.log(editing_row.values);
}

async function submit_edit_row() {
    if(!editing_row.element)return;
    let url = `/${editing_row.method}/${operator.value}/${password.value}`;
    let json = {};
    json["row"] = parseInt(editing_row.element.id.slice(4));
    if(editing_row.method == "editing"){
        editing_row.element.querySelectorAll("textarea").forEach(textarea=>{
            const _id = textarea.id.slice(5);
            if(textarea.value != editing_row.values[_id])json[_id] = textarea.value
        });
    }
    if(editing_row.method == "insert"){
        editing_row.element.querySelectorAll("textarea").forEach(textarea=>{
            json[textarea.id.slice(5, 6)] = textarea.value;
        });
        console.log(`Inserindo valores: ${JSON.stringify(json)}`)
    }
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    });
    const text = await response.text()
    if(text == "Sucesso!"){
        cancel_edit_row()
        get_table();
    }
}

function create_form() {

}

function cancel_edit_row() {
    console.log("cancelando")
    if(!editing_row.element)return;
    
    button_submit_edit.disabled = true;
    button_add_row.disabled = false;
    button_delete_row.disabled = false;

    if(editing_row.method != "editing")
        editing_row.element.querySelectorAll("textarea").forEach(textarea=>{
            const value = editing_row.values[textarea.id.slice(5)];
            if(textarea.value != value)textarea.value = value;
        });
    
    editing_row.element.classList.remove("editing", "delete");
    editing_row = {element: null, values: {}, method: null};

    div_actions_table.classList.remove("open");
    last_row.classList.remove("open");
    input_number_row.classList.remove("open");
    button_add_row.parentElement.classList.remove("open");
}

async function remove_row() {
    if(!editing_row.element)return;
    editing_row.element.classList.add("delete");
    editing_row.method = "remove"
    if(button_submit_edit)button_submit_edit.disabled = false;
}

async function add_row() {
    if(!button_add_row||!input_number_row||editing_row.element)return;
    button_add_row.disabled = true;
    button_delete_row.disabled = true;
    button_submit_edit.disabled = false;
    editing_row.element = last_row;
    editing_row.element.classList.add("editing");
    last_row.querySelectorAll("textarea").forEach(textarea=>{
        editing_row.values[textarea.id.slice(5)] = textarea.value;
    })
    editing_row.method = "insert";
    last_row.classList.add("open");
    button_add_row.parentElement.classList.add("open");
    input_number_row.classList.add("open");
    div_actions_table.classList.add("open");
    const tbody = table.querySelector("tbody");
    tbody.scrollTop = tbody.scrollHeight;
    button_cancel_edit.addEventListener("click", cancel_edit_row);
    last_row.querySelector(".B textarea").focus()
    button_submit_edit.addEventListener("click", submit_edit_row);
}

/* Redimencionar colunas */
let startX = 0;
let clicked = false;
let column_focus = "";

function resizing_column(event) {
    column_focus = event.target.parentElement.className;
    startX = event.clientX;
    clicked = true;
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseleave", removeEvents)
    window.addEventListener("mouseup", confirm_resize);
}

let width = 0;

function resize(event) {
    const diff_x = event.clientX - startX;
    width = width_columns[column_focus] + diff_x;
    document.documentElement.style.setProperty(`--${column_focus}`, `${width}px`);
}

function confirm_resize(){
    width_columns[column_focus] = width;
    update_cookie_width_columns(width_columns);
    removeEvents();
    adjust_width_table(window.innerWidth);
}

function removeEvents() {
    if (clicked) {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseleave", removeEvents)
        window.removeEventListener("mouseup", removeEvents);
    }
    clicked = false;
}

