import { width_columns, update_cookie_width_columns } from "./cco-informa-cookies.js";

function set_value_in_property(property, value){document.documentElement.style.setProperty(property, `${value}`)}
function sum_columns(){Object.entries(width_columns).forEach(([column, width])=>{set_value_in_property(`--${column}`, `${width}px`);width_columns.sum += width;})}
sum_columns()

const table = document.querySelector("table")
function adjust_width_table(width){table.style.width = width <= width_columns.sum?`100%`:`${width_columns.sum + 10}px`}
adjust_width_table(window.innerWidth);
window.addEventListener("resize", event=>adjust_width_table(event.target.innerWidth));

// const open_config_sheet = document.querySelector("#div-config-table")
// open_config_sheet.onclick = (event)=>{const element = event.target;element.classList.toggle("true");element.parentElement.classList.toggle("open")}


/* Editando as linhas */
var editing = {this: false, element: HTMLElement, values: {}}
var focus = {this: false, element: HTMLElement}

function check_editing(target) {
    if(editing.this && editing.element.id != target.id)return;
    if(focus.this && focus.element == target)return active_editing(target);
    focus.element = target;target.classList.add("focus");focus.this = true;return;
}

function active_editing(target) {
    if(editing.this)return;
    editing.this = true;editing.element = target;
    target.classList.add("active");
    target.querySelectorAll("td").forEach(td=>{
        const textarea = td.querySelector("textarea");
        if(!textarea){editing.values = {row: parseInt(td.textContent.trim())};return}
        editing.values[td.className] = textarea.value;textarea.disabled = false;
    })
}

document.querySelectorAll("tbody > tr").forEach(tr=>{
    tr.addEventListener("click", ({target})=>check_editing(target))
    tr.addEventListener("dblclick", ({target})=>active_editing(target))
})
