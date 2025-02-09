document.addEventListener("DOMContentLoaded", () => {
//to make the head click head active 
document.querySelector("#sort-date").addEventListener("click", () => {
    sortTasks("dueDate");
});

document.querySelector("#sort-priority").addEventListener("click", () => {
    sortTasks("priority");
});



    let searchBox = document.querySelector("#search-box");
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
// adding content search

    function filterTasks() {
        let searchText = searchBox.value.toLowerCase();
        let rows = taskTable.querySelectorAll("tr");

        let hasResults = false;

        rows.forEach(row => {
            let taskName = row.cells[0].textContent.toLowerCase();
            let dueDate = row.cells[1].textContent.toLowerCase();
            let priority = row.cells[2].textContent.toLowerCase();

            if (taskName.includes(searchText) || dueDate.includes(searchText) || priority.includes(searchText)) {
                row.style.display = "";
                hasResults = true;
            } else {
                row.style.display = "none";
            }
        });

        // Show "No results found" 
        let noResultsRow = document.getElementById("no-results");
        if (!hasResults) {
            if (!noResultsRow) {
                noResultsRow = document.createElement("tr");
                noResultsRow.id = "no-results";
                noResultsRow.innerHTML = `<td colspan="4" style="text-align: center; color: red;">No results found</td>`;
                taskTable.appendChild(noResultsRow);
            }
        } else {
            if (noResultsRow) noResultsRow.remove();
        }
    }

    searchBox.addEventListener("input", filterTasks);


    // Add Sorting Functionality
    let sortOrder = { dueDate: "asc", priority: "asc" };

function sortTasks(column) {
    console.log("Sorting by:", column); // ✅ Check if function is triggered
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.sort((a, b) => {
        if (column === "dueDate") {
            return sortOrder[column] === "asc"
                ? new Date(a.dueDate) - new Date(b.dueDate)
                : new Date(b.dueDate) - new Date(a.dueDate);
        } else if (column === "priority") {
            let priorityLevels = { High: 3, Medium: 2, Low: 1 };
            return sortOrder[column] === "asc"
                ? priorityLevels[a.priority] - priorityLevels[b.priority]
                : priorityLevels[b.priority] - priorityLevels[a.priority];
        }
    });

    sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";

    localStorage.setItem("tasks", JSON.stringify(savedTasks));
    reloadTable();
}

function reloadTable() {
    taskTable.innerHTML = "";  // Clear the table before reloading tasks
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(addTaskToTable);
}

    loadTasks();
});
