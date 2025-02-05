document.addEventListener("DOMContentLoaded", () => {
    let taskTable = document.querySelector("#task-table tbody");
    let taskForm = document.querySelector("#task-form");
     // Function to check if a task already exists
     function isDuplicateTask(taskName) {
        let existingTasks = document.querySelectorAll("#task-table tbody tr td:first-child");
        for (let task of existingTasks) {
            if (task.textContent.toLowerCase() === taskName.toLowerCase()) {
                return true; // Task already exists
            }
        }
        return false; // Task is unique
    }

    // Function to add a task row to the table
    function addTaskToTable(task) {
        let row = taskTable.insertRow();
        row.insertCell(0).textContent = task.name;
        row.insertCell(1).textContent = task.dueDate;
        row.insertCell(2).textContent = task.priority;

        let actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `
            <button class="complete">✔</button>
            <button class="delete">✖</button>
        `;

        // Event listener to delete a task
        actionsCell.querySelector(".delete").addEventListener("click", () => {
            row.remove();
        });

        // Event listener to mark task as complete
        actionsCell.querySelector(".complete").addEventListener("click", () => {
            row.style.textDecoration = "line-through";
        });
    }

    // Handle form submission
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload

        let taskName = document.querySelector("#task-name").value.trim();
        let taskDate = document.querySelector("#task-date").value;
        let taskPriority = document.querySelector("#task-priority").value;

        if (taskName === "" || taskDate === "") {
            alert("Please enter both task name and due date.");
            return;
        }
        // Check for duplicate tasks
        if (isDuplicateTask(taskName)) {
            alert("This task already exists in the list.");
            return;
        }

        let newTask = { name: taskName, dueDate: taskDate, priority: taskPriority };
        addTaskToTable(newTask);

        // Clear form inputs
        // taskForm.reset();
    });
});
