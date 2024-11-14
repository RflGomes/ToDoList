document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    
    loadTasks();

    
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                id: Date.now(), 
                text: taskText,
                completed: false
            };
            addTaskToList(task);
            saveTaskToStorage(task);
            taskInput.value = ''; 
        }
    });

    
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task));
    }

    
    function addTaskToList(task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) taskItem.classList.add('completed');
        taskItem.setAttribute('data-id', task.id);

        taskItem.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn">Concluir</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </div>
        `;

        taskList.appendChild(taskItem);
        
        taskItem.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(taskItem, task));
        taskItem.querySelector('.edit-btn').addEventListener('click', () => editTask(taskItem, task));
        taskItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(taskItem, task));
    }

    
    function toggleComplete(taskItem, task) {
        task.completed = !task.completed;
        taskItem.classList.toggle('completed', task.completed);
        saveTasksToStorage();
    }

    
    function editTask(taskItem, task) {
        const newText = prompt('Edite sua tarefa:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            taskItem.querySelector('span').textContent = task.text;
            saveTasksToStorage();
        }
    }

    
    function deleteTask(taskItem, task) {
        taskItem.remove();
        removeTaskFromStorage(task.id);
    }

    
    function saveTaskToStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    
    function saveTasksToStorage() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const task = {
                id: parseInt(taskItem.getAttribute('data-id')),
                text: taskItem.querySelector('span').textContent,
                completed: taskItem.classList.contains('completed')
            };
            tasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    
    function removeTaskFromStorage(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});