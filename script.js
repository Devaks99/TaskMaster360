document.addEventListener('DOMContentLoaded', () => {
    const addProjectButton = document.getElementById('add-project');
    const newProjectInput = document.getElementById('new-project');
    const todoList = document.getElementById('todo-items');
    const completedList = document.getElementById('completed-items');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const toggleAuthLink = document.getElementById('toggle-auth');
    const mainContent = document.getElementById('main-content');
    const authSection = document.getElementById('auth-section');
    const logoutLink = document.getElementById('logout');
    const usernameInput = document.getElementById('username'); // Adicionado

    // Eventos
    addProjectButton.addEventListener('click', addProject);
    newProjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addProject();
    });

    authForm.addEventListener('submit', handleAuth);

    // Inicialização
    checkAuth();

    // Recuperar nome de usuário e senha se existirem
    const savedUsername = localStorage.getItem('savedUsername'); // Adicionado
    const savedPassword = localStorage.getItem('savedPassword'); // Adicionado
    if (savedUsername) usernameInput.value = savedUsername; // Adicionado

    function checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            authSection.style.display = 'none';
            mainContent.style.display = 'block';
            logoutLink.style.display = 'block';
            loadTasks();
        } else {
            authSection.style.display = 'flex';
            mainContent.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    }

    function handleAuth(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (authTitle.textContent === 'Login') {
            loginUser(username, password);
        } else {
            registerUser(username, password);
        }
    }

    function loginUser(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', username);
            checkAuth();
        } else {
            alert('Usuário ou senha incorretos.');
        }
    }

    function registerUser(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.username === username);

        if (userExists) {
            alert('Usuário já existe.');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            localStorage.setItem('savedUsername', username); // Adicionado
            localStorage.setItem('savedPassword', password); // Adicionado
            checkAuth();
        }
    }

    // Permitir o toggleAuth ser chamado no HTML
    window.toggleAuth = function() {
        if (authTitle.textContent === 'Login') {
            authTitle.textContent = 'Registro';
            toggleAuthLink.innerHTML = 'Já tem uma conta? <a href="#" onclick="toggleAuth()">Login</a>';
        } else {
            authTitle.textContent = 'Login';
            toggleAuthLink.innerHTML = 'Não tem uma conta? <a href="#" onclick="toggleAuth()">Registre-se</a>';
        }
    }

    // Permitir o logout ser chamado no HTML
    window.logout = function() {
        localStorage.removeItem('currentUser');
        checkAuth();
    }

    function addProject() {
        const projectName = newProjectInput.value.trim();
        if (projectName) {
            const task = { name: projectName, completed: false, user: localStorage.getItem('currentUser') };
            saveTask(task);
            newProjectInput.value = '';
        }
    }

    function createTaskItem(task) {
        const li = document.createElement('li');
        li.textContent = task.name;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Concluir';
        completeButton.addEventListener('click', () => completeTask(task));

        li.appendChild(completeButton);
        return li;
    }

    function completeTask(task) {
        task.completed = true;
        saveTasks();
        renderTasks();
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        renderTasks();
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        todoList.innerHTML = '';
        completedList.innerHTML = '';

        const tasks = getTasks();
        const currentUser = localStorage.getItem('currentUser');
        tasks.forEach(task => {
            if (task.user === currentUser) {
                const listItem = createTaskItem(task);
                if (task.completed) {
                    listItem.classList.add('completed');
                    listItem.querySelector('button').remove();
                    completedList.appendChild(listItem);
                } else {
                    todoList.appendChild(listItem);
                }
            }
        });
    }

    function loadTasks() {
        renderTasks();
    }

    // Calendário básico
    const calendarContainer = document.getElementById('calendar-container');
    const calendar = new FullCalendar.Calendar(calendarContainer, {
        initialView: 'dayGridMonth'
    });
    calendar.render();
});
