let todoInput = document.getElementById("todo_inpt");
let todoList = document.getElementById("todo_add_list");
let todoCounts = document.getElementById("todo_counts");

let remainingCount = 0;

function updateTodoCount() {
    todoCounts.textContent = remainingCount;

    const deleteAllBtn = document.getElementById("delete_all_btn");

    if (remainingCount >= 10 && !deleteAllBtn) {
        createDeleteAllButton();
    }

    if (remainingCount < 10 && deleteAllBtn) {
        deleteAllBtn.remove();
    }
}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".todo_item").forEach((li) => {
        const text = li.querySelector(".task_text").textContent;
        const completed = li.querySelector(".todo_checkBox").checked;
        tasks.push({ text, completed });
    });

    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}

function createlement(taskText = null, isCompleted = false) {
    const task = taskText !== null ? taskText : todoInput.value.trim();
    if (task === "") {
        alert("Please enter a To-Do Task!");
        return;
    }

    const li = document.createElement("li");
    li.className = "todo_item";

    li.innerHTML = `
    <div class="todo_content">
      <input type="checkbox" name="todo check box" class="todo_checkBox" />
      <span class="task_text" title="Edit this task">${task}</span>
    </div>
    <div class="todo_actions">
      <button class="delete_todo"><img src="/To-Do-App/images/close.svg" alt="Close" class="delete_todo_svg" /></button>
    </div>
  `;

    const checkbox = li.querySelector(".todo_checkBox");
    const taskTextSpan = li.querySelector(".task_text");

    checkbox.checked = isCompleted;
    taskTextSpan.classList.toggle("line_through", isCompleted);
    if (!isCompleted) remainingCount++;

    todoList.appendChild(li);
    if (taskText === null) todoInput.value = "";

    updateTodoCount();

    // DELETE
    li.querySelector(".delete_todo").addEventListener("click", () => {
        const wasUnchecked = !checkbox.checked;
        li.remove();
        if (wasUnchecked) remainingCount--;
        updateTodoCount();
        saveTasksToLocalStorage();
    });

    // TOGGLE
    checkbox.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        taskTextSpan.classList.toggle("line_through", isChecked);
        remainingCount += isChecked ? -1 : 1;
        updateTodoCount();
        saveTasksToLocalStorage();
    });

    // EDIT
    taskTextSpan.addEventListener("click", () => {
        if (taskTextSpan.classList.contains("line_through")) {
            alert("Cannot edit a completed task.");
            return;
        }

        const newTask = prompt("Edit your task:", taskTextSpan.textContent);
        if (newTask !== null && newTask.trim() !== "") {
            taskTextSpan.textContent = newTask.trim();
            saveTasksToLocalStorage();
        }
    });

    saveTasksToLocalStorage();
}

function loadTasksFromLocalStorage() {
    const saved = localStorage.getItem("todo_tasks");
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => createlement(task.text, task.completed));
    }
}



todoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        createlement();
    }
});

function createDeleteAllButton() {
    if (document.getElementById("delete_all_btn")) return;

    const deleteAllBtn = document.createElement("button");
    deleteAllBtn.id = "delete_all_btn";
    deleteAllBtn.textContent = "Delete First 10 Tasks";
    deleteAllBtn.className = "delete_all";

    deleteAllBtn.addEventListener("click", () => {
        const confirmation = confirm("Are you sure you want to delete the first 10 tasks?");
        if (!confirmation) return;

        const allTasks = todoList.querySelectorAll(".todo_item");

        let deletedCount = 0;
        for (let i = 0; i < allTasks.length && deletedCount < 10; i++) {
            const task = allTasks[i];
            const checkbox = task.querySelector(".todo_checkBox");

            if (!checkbox.checked) {
                remainingCount--;
            }

            task.remove();
            deletedCount++;
        }

        updateTodoCount();

        deleteAllBtn.remove();
    });

    const inputSection = document.querySelector(".inpt_section");
    inputSection.insertAdjacentElement("afterend", deleteAllBtn);
}

function fetchQuote() {
    const url = "https://zenquotes.io/api/random";
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error("Network response was not ok.");
        })
        .then((data) => {
            const parsedData = JSON.parse(data.contents);
            const quote = parsedData[0].q;
            const author = parsedData[0].a;

            const quoteText = document.getElementById("quote_text");
            quoteText.textContent = `"${quote}" ~ ${author}`;
        })
        .catch((error) => {
            console.error("Quote fetch error:", error);
            document.getElementById("quote_text").textContent =
                "Could not load quote. Please try again.";
        });
}

window.addEventListener("DOMContentLoaded", fetchQuote);

window.addEventListener("DOMContentLoaded", () => {
    loadTasksFromLocalStorage();
    fetchQuote();
});

