const table = document.getElementById("table");

const width_columns_default = {_: 35,A: 90,B: 80,C: 55,D: 55,E: 92,F: 55,G: 70,H: 325,I: 250,J: 400,K: 80, sum: 0};
function create_cookie_width_columns(){
    const width_columns = JSON.stringify(width_columns_default);
    document.cookie=`columns=${width_columns}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    return JSON.parse(decodeURIComponent(width_columns));
}
function update_cookie_width_columns(new_width_columns){
    document.cookie=`columns=${JSON.stringify(new_width_columns)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
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
    console.log(width_columns.sum)
    const _table = table.querySelector("table")
    if(!table)return;
    _table.style.width = width <= width_columns.sum ? `100%` : `${width_columns.sum + 10}px`;
}

window.onresize = ({target}) => adjust_width_table(target.innerWidth);

let editing_row = {element: null, values: {}};
let button_cancel_edit = null;

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
    button_cancel_edit = table.querySelector("#cancel-edit-row");
    console.log("Atualizando tabela...");

    adjust_width_table(window.innerWidth);
    const tbody = table.querySelector("tbody");
    tbody.scrollTop = tbody.scrollHeight;

    const rows = tbody.querySelectorAll("tr");
    rows.forEach(row=>{row.addEventListener("click", _=>{edit_row(row)})});
}

function edit_row(row) {
    if(editing_row.element)return;
    editing_row.element = row;
    console.log(`editando ${row.id}`);
    row.classList.add("editing");
    row.querySelectorAll("td textarea").forEach(textarea=>{
        editing_row.values[textarea.id.slice(5)] = textarea.value;
    });
    button_cancel_edit.addEventListener("click", cancel_edit_row)
    console.log(editing_row.values)
}

function cancel_edit_row() {
    if(!editing_row.element)return;
    console.log("oi")
    editing_row.element.classList.remove("editing");
    editing_row = {element: null, values: {}};

    // button_cancel_edit.removeEventListener("click", cancel_edit_row);
}