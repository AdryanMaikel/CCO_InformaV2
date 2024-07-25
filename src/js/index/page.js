window.onload = async function(_) {
    if(operator && operator.value != "" && password && password.value != "")
        toggle_login();
}

window.onbeforeunload = function(_) {
    if(logged)untoggle_login();
}

window.onresize = function({target}){
    adjust_width_table(target.innerWidth);
};
