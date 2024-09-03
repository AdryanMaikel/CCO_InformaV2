const div_config = document.getElementById("config");

function load_config() {
    return update_config();
}

let with_border = true;

function update_config() {
    let new_config = {
        "border-tbody-rows": with_border ? "1px solid var(--c-black)" : "none",
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
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open")) {
        return;
    }
    div_config.classList.add("open");
}

document.getElementById("close-config").onclick = function(_) {
    div_config.classList.remove("open");
}