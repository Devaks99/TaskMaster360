document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("tasks");
    const anotacoesTextarea = document.getElementById("anotacoes-textarea");
    const calendarEl = document.getElementById('calendar');
    const lembreteForm = document.getElementById('lembrete-form');
    const lembreteFormInner = document.getElementById('lembrete-form-inner');
    const lembreteInput = document.getElementById('lembrete-input');
    
    // Carregar anotações do armazenamento local quando a página é carregada
    const savedAnotacoes = localStorage.getItem("anotacoes");
    if (savedAnotacoes) {
        anotacoesTextarea.value = savedAnotacoes;
    }

    // Carregar lembretes do armazenamento local quando a página é carregada
    const savedLembretes = JSON.parse(localStorage.getItem("lembretes")) || {};
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function(info) {
            const dataStr = info.dateStr;
            // Exibir o formulário de lembrete ao clicar na data
            lembreteInput.value = '';
            lembreteForm.style.display = 'block';
            // Quando o formulário é enviado, salvar o lembrete e ocultar o formulário
            lembreteFormInner.addEventListener('submit', function(event) {
                event.preventDefault();
                const novoLembrete = lembreteInput.value.trim();
                if (novoLembrete !== "") {
                    savedLembretes[dataStr] = novoLembrete;
                    localStorage.setItem("lembretes", JSON.stringify(savedLembretes));
                    // Ocultar o formulário após salvar o lembrete
                    lembreteForm.style.display = 'none';
                    // Aqui você pode atualizar a exibição do calendário se necessário
                    // calendar.refetchEvents();
                }
            });
        },
        eventContent: function(info) {
            const lembrete = savedLembretes[info.dateStr];
            return { html: "<span>" + lembrete + "</span>" };
        }
    });
    calendar.render();

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
