const div_config = document.getElementById("config");
const toogle_border = document.getElementById("toogle-border");

function load_config() {
    return update_config();
}

let with_border = true;

function update_config() {
    let new_config = {
        "border-tbody-rows": with_border ? "1px solid var(--c-black)" : "1px solid transparent",
    }
    save_config(new_config);
}

function create_config() {
    let config_default = {
        "border-tbody-rows": "1px solid var(--c-black)",
    }
    save_config(config_default);
    return config_default;
}

function save_config(new_config) {
    if (old_config == new_config) return;
    old_config = new_config;
    Object.entries(new_config).forEach(([property, value]) => {
        document.documentElement.style.setProperty(`--${property}`, value);
    });
}
let old_config = {};
old_config = load_config();

document.getElementById("open-config").onclick = function(_) {
    section_opened = section.querySelector(".container.open");
    if (section_opened) {
        section_opened.classList.remove("open");
    }
    if (form_login.classList.contains("open")) {
        form_login.classList.remove("open");
    }
    div_config.classList.add("open");
    toogle_border.onclick = function(_) {
        with_border = !with_border;
        toogle_border.classList.toggle("active");
        update_config();
    }
}

document.getElementById("close-config").onclick = function(_) {
    div_config.classList.remove("open");
    toogle_border.onclick = null;
}