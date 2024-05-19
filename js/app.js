
const taskInput = document.querySelector('.task-input input');
const taskbox = document.querySelector('.task-box');

let todos = JSON.parse(localStorage.getItem('todo-list'));

const showTodos = () => {

    let li = '';
    if (todos) {
        todos.map((todo, id) => {
            li +=
                `<li class="task">
                    <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                            <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick=" showMenu(this)" class="uil uil-ellipsis-h"></i>
                         <ul class="task-menu">
                            <li onclick='editTask()'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask()'><i class="uil uil-trash"></i>Delete</li>
                         </ul>
                    </div>
                </li>`;
        });
    };
    taskbox.innerHTML = li;
};

showTodos();

taskInput.addEventListener('keyup', e => {
    let userTask = taskInput.value.trim();

    if (e.key === 'Enter' && userTask) {

        if (!todos) { todos = [] };

        taskInput.value = '';

        let taskInfo = {
            name: userTask,
            status: 'pending'
        };
        todos.push(taskInfo);
        localStorage.setItem('todo-list', JSON.stringify(todos));
        showTodos();
    };

});