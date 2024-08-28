const div_notes = document.getElementById("notes");
const textarea_note = div_notes.querySelector("textarea");
const button_save_note = div_notes.querySelector("#save-note");

let note = "";

async function load_note() {
    const response = await fetch(`/notes/${operator.value}/${password.value}`);
    if(response.ok){
        const text = await response.text();
        textarea_note.value = text;
        note = text;
    }
}

load_note();


async function save_note() {
    const response = await fetch(`/notes/${operator.value}/${password.value}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: textarea_note.value })
    });

    if(response.ok){
        button_save_note.disabled = true;
        button_save_note.onclick = null;
        note = textarea_note.value;
    }
}

document.getElementById("open-notes").onclick = async function(_) {
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open")){
        return;
    }
    div_notes.classList.add("open");
    button_save_note.hidden = false;
    textarea_note.oninput = function(_) {
        button_save_note.disabled = textarea_note.value == note;
        button_save_note.onclick = save_note;
    }
}

document.getElementById("close-notes").onclick = function(_) {
    div_notes.classList.remove("open");
    textarea_note.oninput = null;
    button_save_note.onclick = null;
}