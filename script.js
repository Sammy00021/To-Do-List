
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const saveTaskButton = document.getElementById("save-task");
const saveIndex = document.getElementById("save-index");
const taskList = document.getElementById("task-list");

loadTasks();

addTaskButton.addEventListener("click", function() {
  const task = taskInput.value;

  if (task) {
    const li = document.createElement("li");

    li.textContent = task;

    const span = document.createElement("span");

    span.textContent = "\u00D7";

    span.addEventListener("click", function() {
      taskList.removeChild(li);

      updateStorage();
    });

    li.appendChild(span);

    li.addEventListener("click", function() {
      li.classList.toggle("done");

      updateStorage();
    });

    li.addEventListener("dblclick", function() {
      const index = Array.from(taskList.children).indexOf(li);

      edit(index);
    });

    taskList.appendChild(li);

    taskInput.value = "";

    updateStorage();
  }
});

saveTaskButton.addEventListener("click", function() {
  save();
});

function loadTasks() {
  const tasks = localStorage.getItem("tasks");

  if (tasks) {
    const tasksArray = JSON.parse(tasks);

    for (const task of tasksArray) {
      const li = document.createElement("li");

      li.textContent = task.text;

      if (task.done) {
        li.classList.add("done");
      }

      const span = document.createElement("span");

      span.textContent = "\u00D7";

      span.addEventListener("click", function() {
        taskList.removeChild(li);

        updateStorage();
      });

      li.appendChild(span);

      li.addEventListener("click", function() {
        li.classList.toggle("done");

        updateStorage();
      });

      li.addEventListener("dblclick", function() {
        const index = Array.from(taskList.children).indexOf(li);

        edit(index);
      });

      taskList.appendChild(li);
    }
  }
}

function updateStorage() {
  const listItems = taskList.querySelectorAll("li");

  const tasksArray = [];

  for (const listItem of listItems) {
    const taskObject = {};

    let taskText = listItem.textContent;

    taskText = taskText.slice(0, -1);

    taskObject.text = taskText;

    if (listItem.classList.contains("done")) {
      taskObject.done = true;
    } else {
      taskObject.done = false;
    }

    tasksArray.push(taskObject);
  }

  const tasks = JSON.stringify(tasksArray);

  localStorage.setItem("tasks", tasks);
}

function edit(index) {
  const listItem = taskList.children[index];

  let taskText = listItem.textContent;

  taskText = taskText.slice(0, -1);

  const input = document.createElement("input");

  input.value = taskText;

  taskList.replaceChild(input, listItem);

  saveIndex.value = index;

  addTaskButton.style.display = "none";

  saveTaskButton.style.display = "block";
}

function save() {
  const index = saveIndex.value;

  const input = taskList.children[index];

  const taskText = input.value;

  const listItem = document.createElement("li");

  listItem.textContent = taskText;

  const span = document.createElement("span");

  span.textContent = "\u00D7";

  span.addEventListener("click", function() {
    taskList.removeChild(listItem);

    updateStorage();
  });

  listItem.appendChild(span);

  listItem.addEventListener("click", function() {
    listItem.classList.toggle("done");

    updateStorage();
  });


  listItem.addEventListener("dblclick", function() {
    const index = Array.from(taskList.children).indexOf(listItem);

    edit(index);
  });

  taskList.replaceChild(listItem, input);

  saveIndex.value = "";

  saveTaskButton.style.display = "none";

  addTaskButton.style.display = "block";

  updateStorage();
}
