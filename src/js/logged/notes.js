const div_notes = document.getElementById("notes");
const textarea_note = div_notes.querySelector("textarea");
const button_save_note = div_notes.querySelector("#save-note");

let note = "";

async function load_note() {
    note = await request("notes", "GET");
    textarea_note.value = note;
}
load_note();

async function save_note() {
    if (await request("notes", "POST", { note: textarea_note.value })) {
        button_save_note.disabled = true;
        button_save_note.onclick = null;
        note = textarea_note.value;
    }
}

document.getElementById("open-notes").onclick = async function(_) {
    section_opened = section.querySelector(".container.open");
    if (section_opened) {
        section_opened.classList.remove("open");
    }
    if (form_login.classList.contains("open")) {
        form_login.classList.remove("open");
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