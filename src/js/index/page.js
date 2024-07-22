window.onload = async function(_) {
    if(operator && operator.value != "" && password && password.value != "")
        login();
}

window.onbeforeunload = function(_) {
    if(logged)unlogin();
}

window.onresize = function({target}){
    adjust_width_table(target.innerWidth);
};
