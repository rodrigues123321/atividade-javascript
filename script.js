// ------- Dados -------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");

// ------- Salvar no localStorage -------
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ------- Renderizar Lista -------
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true; // all
    });

    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.toggle("completed", task.completed);

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})">
            <span>${task.text}</span>
            <button class="edit" onclick="editTask(${task.id})">Editar</button>
            <button onclick="deleteTask(${task.id})">Excluir</button>
        `;

        taskList.appendChild(li);
    });

    updatePendingCount();
}

// ------- Contador de Pendentes -------
function updatePendingCount() {
    const count = tasks.filter(t => !t.completed).length;
    pendingCount.textContent = `${count} tarefas pendentes`;
}

// ------- CRUD -------

// Adicionar
document.getElementById("addTaskBtn").onclick = () => {
    if (taskInput.value.trim() === "") return;

    tasks.push({
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
};

// Marcar / Desmarcar concluída
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

// Editar
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Editar tarefa:", task.text);

    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Excluir
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Excluir todas concluídas
document.getElementById("clearCompleted").onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
};

// ------- Filtros -------
document.querySelectorAll(".filters button").forEach(btn => {
    btn.onclick = () => {
        document.querySelector(".filters .active").classList.remove("active");
        btn.classList.add("active");

        currentFilter = btn.getAttribute("data-filter");
        renderTasks();
    };
});

// Render inicial
renderTasks();
