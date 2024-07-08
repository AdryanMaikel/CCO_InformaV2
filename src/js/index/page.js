window.onload = async function(_) {
    if(operator && operator.value != ""
    && password && password.value != "")
        login()
}

window.onbeforeunload = function(_) {
    if(logged) unlogin()
}