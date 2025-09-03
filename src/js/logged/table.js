const MODEL_COLUMNS = {
  _: 35, A: 90, B: 80, C: 55, D: 55, E: 92, F: 55, G: 70, H: 325, I: 250, J: 90, K: 400, L: 80, sum: 0
};

function update_cookie_columns(new_width_columns){
  const string_json = JSON.stringify(new_width_columns);
  document.cookie=`columns=${encodeURIComponent(string_json)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  return new_width_columns;
}

function sum_columns(columns_widths) {
  const sum = Object.entries(columns_widths).reduce((acc, [col, w]) => {
    document.documentElement.style.setProperty(`--${col}`, `${w}px`);
    return col !== "sum" ? acc + Number(w||0) : acc;
  }, 0);
  document.documentElement.style.setProperty(`--sum`, `${sum}px`);
  console.log(`Soma das colunas: ${sum}px.`);
  return { ...columns_widths, sum };
}

function create_cookie_columns() {
  return update_cookie_columns(sum_columns({ ...MODEL_COLUMNS }));
}

let _cookie_columns = document.cookie.split(";").find(c=>c.trim().startsWith("columns="));

function load_cookie_columns() {
  try {
    const parsed = JSON.parse(decodeURIComponent(_cookie_columns.split("=",2)[1]||""));
    return Object.keys(parsed).length === Object.keys(MODEL_COLUMNS).length
      ? sum_columns(parsed)
      : create_cookie_columns();
  } catch {
    return create_cookie_columns();
  }
}

const width_columns = _cookie_columns ? load_cookie_columns() : create_cookie_columns();

let table = document.querySelector("table");

function adjust_width_table() {
    if (!table) {
        console.log("Tabela não encontrada.");
        return;
    }
    console.log("Ajustando largura da tabela.");
    const { sum: total_width } = sum_columns(width_columns);
    console.log(`Largura total das colunas: ${total_width}px`);
    table.style.width = window.innerWidth <= total_width + 58 ? "100%" : `${total_width + 12}px`;
}

window.onresize = adjust_width_table;

const div_table = document.getElementById("div_table");
let editing_row = { element: null, values: {}, method: null };

let div_actions_table = null;
let button_cancel_edit = null;
let button_submit_edit = null;
let button_delete_row = null;
let button_add_row = null;
let input_number_row = null;
let last_row = null;
let overlay = document.querySelector("#overlay");

let old_table = "";
let updated_table = false;
let requests_to_update = 10;

async function check_table() {
    if (editing_row.element) return;
    console.log("Verificando se precisa atualizar a tabela...");
    let html_table = await request("table", "GET");
    if (old_table == html_table) {
        console.log("Tabela igual.");
        return;
    }
    await update_table(html_table);
}



async function update_table(html_table) {
    console.log("Atualizando tabela...");
    overlay.classList.remove("w0");
    window.setTimeout(() => {
        old_table = html_table;
        div_table.innerHTML = html_table;
        table = div_table.querySelector("table");
        adjust_width_table();

        div_actions_table = div_table.querySelector("#actions-table");
        button_cancel_edit = div_table.querySelector("#cancel-edit");
        button_submit_edit = div_table.querySelector("#submit-edit");
        button_delete_row = div_table.querySelector("#delete-row");
        button_add_row = div_table.querySelector("#button-add-row");
        button_add_row.onclick = add_row;
        input_number_row = div_table.querySelector("#number-row");

        div_table.querySelectorAll("button.resize").forEach(
            button => button.addEventListener("mousedown", resizing_column)
        );

        const tbody = div_table.querySelector("tbody");
        tbody.scrollTop = tbody.scrollHeight;
        const rows = tbody.querySelectorAll("tr");
        rows.forEach(row => {
            if (row.classList.contains("last-row")) {
                last_row = row;
            } else {
                row.onclick = edit_row;
            }
        });
        overlay.classList.add("w0");
    }, 500);
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
        console.log(`Editando valores: json`)
    }

    if(editing_row.method == "POST"){
        editing_row.element.querySelectorAll("textarea").forEach(
            textarea=>json[textarea.getAttribute("cell")[0]] = textarea.value
        );
        console.log(`Inserindo valores: `, json)
    }

    if (await request("table", editing_row.method, json)) {
        cancel_edit_row();
        await check_table();
    }
}

function cancel_edit_row() {
    console.log("cancelando");
    if (!editing_row.element) return;

    button_submit_edit.disabled = true;
    button_add_row.disabled = false;
    button_delete_row.disabled = false;

    if(editing_row.method != "PUT")
        editing_row.element.querySelectorAll("textarea").forEach(textarea => {
            const value = editing_row.values[textarea.getAttribute("cell")];
            if (textarea.value != value) textarea.value = value;
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
    if (editing_row.element) return;

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
    tbody.scrollTop = tbody.scrollHeight;
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
    adjust_width_table();
}

function remove_events() {
    if (clicked) {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseleave", remove_events);
        window.removeEventListener("mouseup", remove_events);
    }
    clicked = false;
}

check_table();

// window.setInterval(check_table, 10000);