const div_config_users = document.getElementById("config-users");
const content_config_users = div_config_users.querySelector(".content");

document.getElementById("open-config-users").onclick = function(_) {
    section_opened = section.querySelector(".container.open");
    if (section_opened) {
        section_opened.classList.remove("open");
    }
    if (form_login.classList.contains("open")) {
        form_login.classList.remove("open");
    }
    div_config_users.classList.add("open");
}

document.getElementById("close-config-users").onclick = function(_) {
    div_config_users.classList.remove("open");
}

async function load_config_users() {
    content_config_users.innerHTML = await request("operators", "GET", null, true);
}

load_config_users()

let editingOperator = null;

// Abrir modal para adicionar operador
function addUser() {
    editingOperator = null;
    document.getElementById('modal-title').textContent = 'Adicionar Operador';
    document.getElementById('operator-form').reset();
    document.getElementById('operator-modal').style.display = 'flex';
    document.getElementById('operator-name').focus();
}

// Fechar modal
function closeModal() {
    document.getElementById('operator-form').reset();
    document.getElementById('operator-modal').style.display = 'none';
    editingOperator = null;
}

// Editar operador
function editOperator(name) {
    editingOperator = name;
    document.getElementById('modal-title').textContent = 'Editar Operador';
    document.getElementById('operator-name').value = name;
    document.getElementById('operator-password').value = '';
    document.getElementById('operator-modal').style.display = 'flex';
    document.getElementById('operator-password').focus();
}

// Deletar operador
async function deleteOperator(name) {
    if (!confirm(`Tem certeza que deseja excluir o operador "${name}"?`)) {
        return;
    }

    try {
        const success = await request("operators", "DELETE", { name: name });
        if (success) {
            await load_config_users();
            console.log(`Operador ${name} excluído com sucesso`);
        } else {
            alert('Erro ao excluir operador');
        }
    } catch (error) {
        console.error('Erro ao excluir operador:', error);
        alert('Erro ao excluir operador');
    }
}

// Resetar tentativas
async function resetTentatives(name) {
    try {
        const success = await request("operators", "PUT", { name: name });
        if (success) await load_config_users();
    } catch (error) {
        console.error('Erro ao resetar tentativas:', error);
    }
}

// Submit do formulário
document.getElementById('operator-form').onsubmit = async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('operator-name').value.trim();
    const password = document.getElementById('operator-password').value;

    if (!name || !password) {
        alert('Nome e senha são obrigatórios');
        return;
    }

    try {
        let message;
        if (editingOperator) {
            message = await request("operators", "PUT", {
                name: editingOperator,
                newPassword: password
            }, true);
        } else {
            // Adicionar novo operador
            message = await request("operators", "POST", {
                name: name,
                password: password
            }, true);
        }

        if (message) {
            alert(message);
            closeModal();
            await load_config_users();
        }
    } catch (error) {
        console.error('Erro ao salvar operador:', error);
        alert('Erro ao salvar operador');
    }
}

// Fechar modal ao clicar fora
document.getElementById('operator-modal').onclick = function(e) {
    if (e.target === this) {
        closeModal();
    }
}