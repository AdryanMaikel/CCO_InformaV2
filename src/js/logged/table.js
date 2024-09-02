function update_cookie_columns(new_width_columns){
    const string_json = JSON.stringify(new_width_columns);
    document.cookie=`columns=${string_json}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    return new_width_columns;
};

function sum_columns(columns_widths) {
    const sum = Object.entries(columns_widths).reduce((accumulator, [column, width]) => {
        document.documentElement.style.setProperty(`--${column}`, `${width}px`);
        return column !== "sum" ? accumulator + width : accumulator;
    }, 0);
    document.documentElement.style.setProperty(`--sum`, `${sum}px`);
    console.log(`Soma das colunas: ${sum}px.`);
    return { ...columns_widths, sum };
}

function create_cookie_columns() {
    return update_cookie_columns(
        sum_columns({
            _: 35,
            A: 90,
            B: 80,
            C: 55,
            D: 55,
            E: 92,
            F: 55,
            G: 70,
            H: 325,
            I: 250,
            J: 400,
            K: 80,
            sum: 0    
        })
    );
}

let _cookie_columns = document.cookie.split(";").find(cookie=>cookie.trim().startsWith("columns="))
function load_cookie_columns() {
    return sum_columns(JSON.parse(decodeURIComponent(_cookie_columns.split("=")[1])));
}

const width_columns = _cookie_columns?load_cookie_columns():create_cookie_columns();

let table = document.querySelector("table");

function adjust_width_table() {
    if (!table) {
        console.log("Tabela não encontrada.");
        return;
    }
    console.log("Ajustando largura da tabela.");
    const { sum: totalWidth } = sum_columns(width_columns);
    console.log(`Largura total das colunas: ${totalWidth}px`);
    table.style.width = window.innerWidth <= totalWidth + 58 ? "100%" : `${totalWidth + 12}px`;
}

window.onresize = adjust_width_table;

const div_table = document.getElementById("table");
let editing_row = { element: null, values: {}, method: null };

let div_actions_table = null;
let button_cancel_edit = HTMLElement | null;
let button_submit_edit = null;
let button_delete_row = null;
let button_add_row = null;
let input_number_row = null;
let last_row = null;
let overlay = document.querySelector("#overlay");

let old_table = "";
async function get_table() {
    if (!logged || editing_row.element) return;

    console.log("Obtendo tabela...");
    let _table = await request("table", "GET");
    if (old_table == _table) return;
    old_table = _table;
    div_table.innerHTML = _table;

    table = div_table.querySelector("table");

    div_actions_table = div_table.querySelector("#actions-table");

    button_cancel_edit = div_table.querySelector("#cancel-edit");
    button_submit_edit = div_table.querySelector("#submit-edit");
    button_delete_row = div_table.querySelector("#delete-row");
    
    button_add_row = div_table.querySelector("#button-add-row");
    button_add_row.onclick = add_row;
    
    input_number_row = div_table.querySelector("#number-row");

    console.log("Atualizando tabela...");
    adjust_width_table(window.innerWidth);

    div_table.querySelectorAll("button.resize").forEach(
        button => button.addEventListener("mousedown", resizing_column)
    );

    const tbody = div_table.querySelector("tbody");
    tbody.scrollTop = tbody.scrollHeight;
    const rows = tbody.querySelectorAll("tr");
    rows.forEach(row => {
        if (row.classList.contains("last-row")) {
            last_row = row;
            return
        };
        row.onclick = edit_row;
    });
    overlay.classList.add("w0");
}

function edit_row(event) {
    if (editing_row.element) return;
    editing_row.element = event.target;
    console.log(`editando linha: ${editing_row.element.getAttribute("row")}`);
    editing_row.element.querySelectorAll("textarea").forEach(
        textarea => editing_row.values[textarea.getAttribute("cell")] = textarea.value
    );
    editing_row.element.classList.add("editing");
    editing_row.method = "PUT";
    button_add_row.disabled = true;
    button_submit_edit.disabled = false;
    div_actions_table.classList.add("open");
    button_cancel_edit.onclick = cancel_edit_row;
    button_submit_edit.onclick = submit_edit_row;
    button_delete_row.onclick = remove_row;
    
    console.log(editing_row.values);
}

async function submit_edit_row() {
    if (!editing_row.element) return;
    overlay.classList.remove("w0");

    let json = { row: parseInt(editing_row.element.getAttribute("row")) };

    if(editing_row.method == "PUT"){
        editing_row.element.querySelectorAll("textarea").forEach(textarea => {
            const column = textarea.getAttribute("cell");
            if(textarea.value != editing_row.values[column])
                json[column] = textarea.value;
        });
        if (Object.keys(json).length <= 1) {
            console.log("Nada de diferente");
            cancel_edit_row();
            return;
        }
        console.log(`Editando valores: ${json}`)
    }

    if(editing_row.method == "POST"){
        editing_row.element.querySelectorAll("textarea").forEach(
            textarea=>json[textarea.getAttribute("cell")[0]] = textarea.value
        );
        console.log(`Inserindo valores: ${json}`)
    }

    if (!await request("table", editing_row.method, json))
        return;

    cancel_edit_row();
    get_table();
}


function cancel_edit_row() {
    console.log("cancelando");
    window.setTimeout(function(){overlay.classList.add("w0")}, 500)
    if(!editing_row.element)return;

    button_submit_edit.disabled = true;
    button_add_row.disabled = false;
    button_delete_row.disabled = false;

    if(editing_row.method != "PUT")
        editing_row.element.querySelectorAll("textarea").forEach(textarea => {
            const value = editing_row.values[textarea.getAttribute("cell")];
            if(textarea.value != value)textarea.value = value;
        });
    
    editing_row.element.classList.remove("editing", "delete");
    editing_row = { element: null, values: {}, method: null };
    div_actions_table.classList.remove("open");
    last_row.classList.add("h0");
    input_number_row.classList.remove("open");
    button_add_row.parentElement.classList.remove("open");
    button_cancel_edit.onclick = null;
    button_submit_edit.onclick = null;
    button_delete_row.onclick = null;
}

async function remove_row() {
    if (!editing_row.element) return;
    editing_row.element.classList.add("delete");
    editing_row.method = "DELETE";
    button_submit_edit.disabled = false;
}

async function add_row() {
    if (!button_add_row || !input_number_row || editing_row.element || !table) return;
    button_add_row.disabled = true;
    button_delete_row.disabled = true;
    button_submit_edit.disabled = false;
    editing_row.element = last_row;
    editing_row.element.classList.add("editing");
    editing_row.method = "POST";
    last_row.querySelectorAll("textarea").forEach(
        textarea => editing_row.values[textarea.getAttribute("cell")] = textarea.value
    );
    last_row.classList.remove("h0");
    button_add_row.parentElement.classList.add("open");
    input_number_row.classList.add("open");
    div_actions_table.classList.add("open");

    const tbody = table.querySelector("tbody");
    tbody.scrollTo({ top: tbody.scrollHeight, behavior: 'smooth' });
    last_row.querySelector(".B textarea").focus();

    button_cancel_edit.onclick = cancel_edit_row;
    button_submit_edit.onclick = submit_edit_row;
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
    window.addEventListener("mouseleave", remove_events);
    window.addEventListener("mouseup", confirm_resize);
}

let width = 0;

function resize(event) {
    const diff_x = event.clientX - startX;
    width = width_columns[column_focus] + diff_x;
    document.documentElement.style.setProperty(`--${column_focus}`, `${width}px`);
}

function confirm_resize() {
    width_columns[column_focus] = width;
    update_cookie_columns(width_columns);
    remove_events();
    adjust_width_table(window.innerWidth);
}

function remove_events() {
    if (clicked) {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseleave", remove_events);
        window.removeEventListener("mouseup", remove_events);
    }
    clicked = false;
}

get_table()