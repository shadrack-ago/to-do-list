document.addEventListener("DOMContentLoaded", () => {
    let taskTable = document.querySelector("#task-table tbody");
    let taskForm = document.querySelector("#task-form");

    function loadTasks() {
        let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(addTaskToTable);
    }

    function saveTasks() {
        let tasks = [];
        document.querySelectorAll("#task-table tbody tr").forEach(row => {
            let task = {
                name: row.cells[0].textContent,
                dueDate: row.cells[1].textContent,
                priority: row.cells[2].textContent
            };
            tasks.push(task);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function isDuplicateTask(taskName) {
        let existingTasks = document.querySelectorAll("#task-table tbody tr td:first-child");
        for (let task of existingTasks) {
            if (task.textContent.toLowerCase() === taskName.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    function addTaskToTable(task) {
        let row = taskTable.insertRow();
        row.insertCell(0).textContent = task.name;
        row.insertCell(1).textContent = task.dueDate;
        row.insertCell(2).textContent = task.priority;

        let actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `
            <button class="edit">✏ Edit</button>
            <button class="complete">✔</button>
            <button class="delete">✖</button>
        `;

        actionsCell.querySelector(".delete").addEventListener("click", () => {
            row.remove();
            saveTasks();
        });

        actionsCell.querySelector(".complete").addEventListener("click", () => {
            row.style.textDecoration = "line-through";
        });

        actionsCell.querySelector(".edit").addEventListener("click", () => {
            editTask(row);
        });

        saveTasks();
    }

    function editTask(row) {
        let taskCell = row.cells[0];
        let oldTaskName = taskCell.textContent;

        let input = document.createElement("input");
        input.type = "text";
        input.value = oldTaskName;
        taskCell.innerHTML = "";
        taskCell.appendChild(input);

        input.focus();

        input.addEventListener("blur", () => saveEdit(row, input));
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") saveEdit(row, input);
        });
    }

    function saveEdit(row, input) {
        let newTaskName = input.value.trim();
        if (newTaskName === "") {
            alert("Task name cannot be empty!");
            return;
        }

        row.cells[0].textContent = newTaskName;
        saveTasks();
    }

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let taskName = document.querySelector("#task-name").value.trim();
        let taskDate = document.querySelector("#task-date").value;
        let taskPriority = document.querySelector("#task-priority").value;

        if (taskName === "" || taskDate === "") {
            alert("Please enter both task name and due date.");
            return;
        }

        if (isDuplicateTask(taskName)) {
            alert("This task already exists.");
            return;
        }

        let newTask = { name: taskName, dueDate: taskDate, priority: taskPriority };
        addTaskToTable(newTask);

        taskForm.reset();
    });

    loadTasks();
});
