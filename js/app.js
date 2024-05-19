// Seleccionamos los elementos necesarios del DOM
const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

// Definimos algunas variables que vamos a usar más adelante
let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list")); // Recuperamos las tareas desde el almacenamiento local

// Agregamos un evento de click a cada filtro
[...filters].map(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active"); // Quitamos la clase 'active' al filtro activo
        btn.classList.add("active"); // Añadimos la clase 'active' al filtro seleccionado
        showTodo(btn.id); // Mostramos las tareas correspondientes al filtro seleccionado
    });
});

// Función para mostrar las tareas
const showTodo = (filter) => {
    let liTag = "";
    if (todos) {
        todos.map((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                // Creamos el elemento li para cada tarea
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            };
        });
    };

    // Actualizamos el contenido del taskBox
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all"); // Mostramos todas las tareas al cargar la página

// Función para mostrar el menú de una tarea
const showMenu = (selectedTask) => {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show"); // Ocultamos el menú si se hace click fuera de él
        };
    });
};

// Función para actualizar el estado de una tarea
const updateStatus = (selectedTask) => {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed"; // Marcamos la tarea como completada
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending"; // Marcamos la tarea como pendiente
    };
    localStorage.setItem("todo-list", JSON.stringify(todos)) // Guardamos las tareas en el almacenamiento local
};

// Función para editar una tarea
const editTask = (taskId, textName) => {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName; // Ponemos el nombre de la tarea en el input
    taskInput.focus();
    taskInput.classList.add("active");
};

// Función para eliminar una tarea
const deleteTask = (deleteId, filter) => {
    isEditTask = false;
    todos.splice(deleteId, 1); // Eliminamos la tarea del array
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Guardamos las tareas en el almacenamiento local
    showTodo(filter); // Mostramos las tareas correspondientes al filtro seleccionado
};

// Evento para el botón de eliminar todas las tareas
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length); // Eliminamos todas las tareas del array
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Guardamos las tareas en el almacenamiento local
    showTodo() // Mostramos las tareas (que en este caso no debería haber ninguna)
});

// Evento para el input de añadir tareas
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" }; // Creamos la nueva tarea
            todos.push(taskInfo); // Añadimos la nueva tarea al array
        } else {
            isEditTask = false;
            todos[editId].name = userTask; // Actualizamos el nombre de la tarea
        };
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos)); // Guardamos las tareas en el almacenamiento local
        showTodo(document.querySelector("span.active").id); // Mostramos las tareas correspondientes al filtro seleccionado
    };
});
