const div_notes = document.getElementById("notes");

document.getElementById("open-notes").onclick = function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open")){
        return;
    }
    div_notes.classList.add("open");
}

document.getElementById("close-notes").onclick = function(_) {
    div_notes.classList.remove("open");
}