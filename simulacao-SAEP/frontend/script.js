const API_URL = 'http://localhost:3000/api';

const formUsuario = document.getElementById('formUsuario');
if (formUsuario) {
    formUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;

        const res = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email })
        });
        
        if (res.ok) {
            alert('Usuario cadastrado com sucesso!');
            formUsuario.reset();
        } else {
            alert('Erro ao cadastrar usuario.');
        }
    });
}

async function prepararFormTarefa() {
    const selectObj = document.getElementById('id_usuario');
    const resUsers = await fetch(`${API_URL}/usuarios`);
    const usuarios = await resUsers.json();
    
    usuarios.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id;
        option.textContent = u.nome;
        selectObj.appendChild(option);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        document.getElementById('titulo-form').textContent = 'Editar Tarefa';
        const resTask = await fetch(`${API_URL}/tarefas`);
        const tarefas = await resTask.json();
        const tarefa = tarefas.find(t => t.id == editId);
        
        if (tarefa) {
            document.getElementById('tarefa_id').value = tarefa.id;
            document.getElementById('id_usuario').value = tarefa.id_usuario;
            document.getElementById('descricao').value = tarefa.descricao;
            document.getElementById('setor').value = tarefa.setor;
            document.getElementById('prioridade').value = tarefa.prioridade;
            document.getElementById('tarefa_status').value = tarefa.status;
        }
    }
}

const formTarefa = document.getElementById('formTarefa');
if (formTarefa) {
    formTarefa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('tarefa_id').value;
        const dados = {
            id_usuario: document.getElementById('id_usuario').value,
            descricao: document.getElementById('descricao').value,
            setor: document.getElementById('setor').value,
            prioridade: document.getElementById('prioridade').value,
            status: document.getElementById('tarefa_status').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/tarefas/${id}` : `${API_URL}/tarefas`;

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert(id ? 'Tarefa atualizada!' : 'Tarefa cadastrada com sucesso!');
            window.location.href = 'index.html';
        }
    });
}

async function carregarTarefas() {
    const res = await fetch(`${API_URL}/tarefas`);
    const tarefas = await res.json();

    document.querySelector('#col-a-fazer .task-list').innerHTML = '';
    document.querySelector('#col-fazendo .task-list').innerHTML = '';
    document.querySelector('#col-pronto .task-list').innerHTML = '';

    tarefas.forEach(t => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <p><strong>Desc:</strong> ${t.descricao}</p>
            <p><strong>Setor:</strong> ${t.setor}</p>
            <p><strong>Prioridade:</strong> ${t.prioridade}</p>
            <p><strong>Usuario:</strong> ${t.nome_usuario}</p>
            <div class="task-actions">
                <select onchange="mudarStatus(${t.id}, this.value)">
                    <option value="a fazer" ${t.status === 'a fazer' ? 'selected' : ''}>A Fazer</option>
                    <option value="fazendo" ${t.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
                    <option value="pronto" ${t.status === 'pronto' ? 'selected' : ''}>Pronto</option>
                </select>
                <button class="btn-edit" onclick="editarTarefa(${t.id})">Editar</button>
                <button class="btn-del" onclick="excluirTarefa(${t.id})">X</button>
            </div>
        `;

        const colId = t.status === 'a fazer' ? 'col-a-fazer' : 
                      t.status === 'fazendo' ? 'col-fazendo' : 'col-pronto';
        document.querySelector(`#${colId} .task-list`).appendChild(card);
    });
}

async function mudarStatus(id, novoStatus) {
    const res = await fetch(`${API_URL}/tarefas`);
    const tarefas = await res.json();
    const tarefa = tarefas.find(t => t.id == id);
    tarefa.status = novoStatus;

    await fetch(`${API_URL}/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarefa)
    });
    carregarTarefas();
}

function editarTarefa(id) {
    window.location.href = `cadastro_tarefa.html?edit=${id}`;
}

async function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });
        carregarTarefas();
    }
}