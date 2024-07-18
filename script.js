const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskTime = document.getElementById("task-time");
const taskPriority = document.getElementById("task-priority");
const addTaskButton = document.getElementById("add-task");
const saveTaskButton = document.getElementById("save-task");
const saveIndex = document.getElementById("save-index");
const taskList = document.getElementById("task-list");
const darkModeToggle = document.getElementById("dark-mode-toggle");

loadTasks();

addTaskButton.addEventListener("click", function() {
  const task = taskInput.value;
  const date = taskDate.value;
  const time = taskTime.value;
  const priority = taskPriority.value;

  if (task && date && time) {
    addTask(task, date, time, priority);
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    taskPriority.value = "Low";
  }
});

saveTaskButton.addEventListener("click", function() {
  save();
});

darkModeToggle.addEventListener("change", function() {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
  taskInput.classList.toggle("dark-mode");
  taskDate.classList.toggle("dark-mode");
  taskTime.classList.toggle("dark-mode");
  taskPriority.classList.toggle("dark-mode");
  addTaskButton.classList.toggle("dark-mode");
  saveTaskButton.classList.toggle("dark-mode");

  const tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    task.classList.toggle("dark-mode");
  });

  updateStorage();
});

function addTask(task, date, time, priority, done = false, comment = "") {
  const li = document.createElement("li");
  li.classList.add(priority.toLowerCase());

  li.innerHTML = `
    <span>${task} (Due: ${new Date(date).toLocaleDateString()} ${time}, Priority: ${priority})</span>
    <span class="due-time">${time}</span>
    <span class="comment">${comment}</span>
    <span class="close">\u00D7</span>
  `;

  if (done) {
    li.classList.add("done");
  }

  const closeSpan = li.querySelector(".close");

  closeSpan.addEventListener("click", function() {
    taskList.removeChild(li);
    updateStorage();
  });

  li.addEventListener("click", function() {
    li.classList.toggle("done");

    if (li.classList.contains("done") && !li.querySelector(".comment").textContent) {
      const commentText = prompt("Add a comment about the task:");
      li.querySelector(".comment").textContent = commentText;
    }

    updateStorage();
  });

  li.addEventListener("dblclick", function() {
    const index = Array.from(taskList.children).indexOf(li);
    edit(index);
  });

  taskList.appendChild(li);
  updateStorage();
}

function loadTasks() {
  const tasks = localStorage.getItem("tasks");
  const darkMode = localStorage.getItem("dark-mode");

  if (darkMode === "enabled") {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
    document.querySelector(".container").classList.add("dark-mode");
    taskInput.classList.add("dark-mode");
    taskDate.classList.add("dark-mode");
    taskTime.classList.add("dark-mode");
    taskPriority.classList.add("dark-mode");
    addTaskButton.classList.add("dark-mode");
    saveTaskButton.classList.add("dark-mode");
  }

  if (tasks) {
    const tasksArray = JSON.parse(tasks);

    for (const task of tasksArray) {
      addTask(task.text, task.date, task.time, task.priority, task.done, task.comment);
    }
  }
}

function updateStorage() {
  const listItems = taskList.querySelectorAll("li");

  const tasksArray = [];

  for (const listItem of listItems) {
    const taskObject = {};
    const taskSpan = listItem.querySelector("span:first-child");
    const commentSpan = listItem.querySelector(".comment");
    const dueTimeSpan = listItem.querySelector(".due-time");

    const taskText = taskSpan.textContent.split(" (Due: ")[0];
    const taskDate = new Date(taskSpan.textContent.split(" (Due: ")[1].split(" ")[0]).toISOString().split("T")[0];
    const taskTime = dueTimeSpan.textContent;
    const taskPriority = taskSpan.textContent.split("Priority: ")[1].slice(0, -1);

    taskObject.text = taskText;
    taskObject.date = taskDate;
    taskObject.time = taskTime;
    taskObject.priority = taskPriority;
    taskObject.done = listItem.classList.contains("done");
    taskObject.comment = commentSpan.textContent;

    tasksArray.push(taskObject);
  }

  const tasks = JSON.stringify(tasksArray);
  localStorage.setItem("tasks", tasks);
  localStorage.setItem("dark-mode", darkModeToggle.checked ? "enabled" : "disabled");
}

function edit(index) {
  const listItem = taskList.children[index];
  const taskSpan = listItem.querySelector("span:first-child");

  const taskText = taskSpan.textContent.split(" (Due: ")[0];
  const taskDateValue = new Date(taskSpan.textContent.split(" (Due: ")[1].split(" ")[0]).toISOString().split("T")[0];
  const taskTimeValue = listItem.querySelector(".due-time").textContent;
  const taskPriorityValue = taskSpan.textContent.split("Priority: ")[1].slice(0, -1);

  taskInput.value = taskText;
  taskDate.value = taskDateValue;
  taskTime.value = taskTimeValue;
  taskPriority.value = taskPriorityValue;

  saveIndex.value = index;

  addTaskButton.style.display = "none";
  saveTaskButton.style.display = "block";
}

function save() {
  const index = saveIndex.value;
  const input = taskList.children[index];

  const taskText = taskInput.value;
  const taskDateValue = taskDate.value;
  const taskTimeValue = taskTime.value;
  const taskPriorityValue = taskPriority.value;

  taskList.removeChild(input);

  addTask(taskText, taskDateValue, taskTimeValue, taskPriorityValue);

  saveIndex.value = "";

  saveTaskButton.style.display = "none";
  addTaskButton.style.display = "block";
}
