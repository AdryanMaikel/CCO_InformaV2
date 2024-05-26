import { width_columns, update_cookie_width_columns } from "./cco-informa-cookies.js";

function set_value_in_property(property, value){document.documentElement.style.setProperty(property, `${value}`)}
function sum_columns(){Object.entries(width_columns).forEach(([column, width])=>{set_value_in_property(`--${column}`, `${width}px`);width_columns.sum += width;})}
sum_columns()

const table = document.querySelector("table")
function adjust_width_table(width){table.style.width = width <= width_columns.sum?`100%`:`${width_columns.sum + 10}px`}
adjust_width_table(window.innerWidth);
window.addEventListener("resize", event=>adjust_width_table(event.target.innerWidth));