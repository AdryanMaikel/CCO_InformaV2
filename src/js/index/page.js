window.onresize = function({target}) {
    adjust_width_table(target.innerWidth);
}

window.onreset = function(event) {
    event.preventDefault();
}