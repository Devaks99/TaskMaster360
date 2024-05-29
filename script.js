document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("tasks");
    const anotacoesTextarea = document.getElementById("anotacoes-textarea");

    // Carregar anotações do armazenamento local quando a página é carregada
    const savedAnotacoes = localStorage.getItem("anotacoes");
    if (savedAnotacoes) {
        anotacoesTextarea.value = savedAnotacoes;
    }

    // Adicionar evento de mudança para salvar as anotações quando o usuário digita
    anotacoesTextarea.addEventListener("input", function() {
        salvarAnotacoes(anotacoesTextarea.value);
    });

    // Adicionar tarefa
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            taskInput.value = "";
        }
    });

    // Função para adicionar tarefa na lista
    function addTask(taskText) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
            <input type="checkbox" class="status-checkbox"> Concluída
        `;
        taskList.appendChild(taskItem);

        // Adicionar evento de clique para editar e excluir tarefa
        const editBtn = taskItem.querySelector(".edit-btn");
        const deleteBtn = taskItem.querySelector(".delete-btn");
        const statusCheckbox = taskItem.querySelector(".status-checkbox");

        editBtn.addEventListener("click", function() {
            editTask(taskItem);
        });

        deleteBtn.addEventListener("click", function() {
            deleteTask(taskItem);
        });

        statusCheckbox.addEventListener("change", function() {
            toggleTaskStatus(taskItem);
        });
    }

    // Função para editar tarefa
    function editTask(taskItem) {
        const taskText = taskItem.querySelector("span").textContent;
        const newText = prompt("Editar tarefa:", taskText);
        if (newText !== null && newText.trim() !== "") {
            taskItem.querySelector("span").textContent = newText;
        }
    }

    // Função para excluir tarefa
    function deleteTask(taskItem) {
        taskItem.remove();
    }

    // Função para marcar tarefa como concluída ou em andamento
    function toggleTaskStatus(taskItem) {
        const checkbox = taskItem.querySelector(".status-checkbox");
        const isCompleted = checkbox.checked;
        if (isCompleted) {
            taskItem.classList.add("completed");
        } else {
            taskItem.classList.remove("completed");
        }
    }

    // Função para salvar as anotações no armazenamento local
    function salvarAnotacoes(anotacoes) {
        localStorage.setItem("anotacoes", anotacoes);
    }
});
