import { width_columns, update_cookie_width_columns } from "./cco-informa-cookies.js";

function sum_columns() {
    Object.entries(width_columns).forEach(([column, width]) => {
        document.documentElement.style.setProperty(`--${column}`, `${width}px`);
        width_columns.sum += width;
    });
}
sum_columns();

const table = document.querySelector("table");
function adjust_width_table(width) {
    table.style.width = width <= width_columns.sum ? `100%` : `${width_columns.sum + 10}px`;
}
adjust_width_table(window.innerWidth);
window.onresize = ({target}) => adjust_width_table(target.innerWidth);

var editing = {this: false, element: HTMLElement, values: {}, action: ""};
var focus = {this: false, element: HTMLElement};

var timer = 99;
const timer_element = document.querySelector("#update-sheet span");
const button_reload = document.querySelector("#update-sheet button");
function reload_page() {
    window.parent.postMessage("reload", "*");
    button_reload.classList.add("load");
}
button_reload.onclick = reload_page;
setInterval(() => {
    if(timer <= 0) {if(!editing.this) reload_page(); return;}
    timer -= 1;
    timer_element.textContent = timer;
}, 1000)


/* Editando as linhas */
const buttons_actions = document.getElementById("actions-row")

function active_editing(target, action) {
    if(editing.this || !focus.this) return;
    buttons_actions.classList.replace("focus", "confirm");
    target.classList.replace("focus", action == "del" ? "delete" : "active");
    editing.this = true;
    editing.element = target;
    editing.action = action;
    target.querySelectorAll("td").forEach(td=>{
        const textarea = td.querySelector("textarea");
        if(!textarea) {
            editing.values = { row: parseInt(td.textContent.trim()) };
            return;
        }
        if(action == "del") return;
        editing.values[td.className] = textarea.value;
        textarea.disabled = false;
        if(action == "add") textarea.value = "";
    })
    // console.log(editing)
}

function check_editing(target) {
    if(editing.this && editing.element.id != target.id) return;
    if(focus.this) {
        if(focus.element == target) {
            active_editing(target, "edit");
            return;
        }
        focus.element.classList.remove("focus");
    }
    focus.element = target;
    target.classList.add("focus");
    focus.this = true;
    buttons_actions.classList.add("focus");
}

document.querySelectorAll("tbody > tr").forEach(tr=>{
    tr.onclick = ({target}) => check_editing(target);
})

document.getElementById("del-row").onclick = () => active_editing(focus.element, "del")
document.getElementById("edt-row").onclick = () => active_editing(focus.element, "edit")
document.getElementById("add-row").onclick = () => active_editing(focus.element, "add")

function reset_layout() {
    if(!editing.this) return;
    if(editing.action == "edit" || editing.action == "add") {
        editing.element.querySelectorAll("td textarea").forEach(textarea=>{
            textarea.value = editing.values[textarea.parentElement.className]
            textarea.disabled = true;
        })
    }
    editing.element.classList.remove("delete", "active", "focus");
    buttons_actions.classList.remove("focus", "confirm");
    editing = {this: false, element: HTMLElement, values: {}, action: ""};
    focus = {this: false, element: HTMLElement};
}

document.getElementById("cancel-editing").onclick = reset_layout;
