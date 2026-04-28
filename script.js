// ── Auth guard ────────────────────────────────────────────
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "login.html";

// ── State ──────────────────────────────────────────────────
let tasks = [];
let currentFilter = 'all';
let currentSort = 'added';
let editingIndex = null;

// ── DOM refs ───────────────────────────────────────────────
const taskInput    = document.getElementById("task-input");
const taskDate     = document.getElementById("task-date");
const taskTime     = document.getElementById("task-time");
const taskPriority = document.getElementById("task-priority");
const taskCategory = document.getElementById("task-category");
const taskNote     = document.getElementById("task-note");
const addBtn       = document.getElementById("add-task-btn");
const cancelBtn    = document.getElementById("cancel-edit-btn");
const addBtnLabel  = document.getElementById("add-btn-label");
const taskListEl   = document.getElementById("task-list");
const emptyState   = document.getElementById("empty-state");
const searchInput  = document.getElementById("search-input");
const progressBar  = document.getElementById("progress-bar");
const progressLabel= document.getElementById("progress-label");
const darkToggle   = document.getElementById("dark-mode-toggle");

// ── Init ───────────────────────────────────────────────────
(function init() {
  // User info
  document.getElementById("user-name-display").textContent = currentUser;
  document.getElementById("user-avatar").textContent = currentUser[0].toUpperCase();

  // Dark mode
  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  }

  // Load tasks
  const saved = localStorage.getItem(currentUser + "_tasks");
  if (saved) tasks = JSON.parse(saved);

  renderTasks();
  updateCounts();
})();

// ── Save / Load ────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem(currentUser + "_tasks", JSON.stringify(tasks));
}

// ── Render ─────────────────────────────────────────────────
function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  taskListEl.innerHTML = "";

  let filtered = tasks.filter(t => {
    const matchSearch = !query ||
      t.text.toLowerCase().includes(query) ||
      (t.note && t.note.toLowerCase().includes(query)) ||
      (t.category && t.category.toLowerCase().includes(query));

    const matchFilter =
      currentFilter === 'all'    ? true :
      currentFilter === 'active' ? !t.done :
      currentFilter === 'done'   ? t.done :
      currentFilter === t.priority.toLowerCase();

    return matchSearch && matchFilter;
  });

  // Sort
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  filtered = [...filtered].sort((a, b) => {
    if (currentSort === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (currentSort === 'due') {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00'));
    }
    if (currentSort === 'name') return a.text.localeCompare(b.text);
    return 0; // 'added' = original order
  });

  if (filtered.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    filtered.forEach(task => {
      const origIndex = tasks.indexOf(task);
      taskListEl.appendChild(createTaskEl(task, origIndex));
    });
  }

  updateProgress();
  updateCounts();
}

function createTaskEl(task, index) {
  const li = document.createElement("li");
  li.className = `task-item ${task.priority.toLowerCase()} ${task.done ? 'done' : ''}`;

  const now = new Date();
  let dueText = "";
  let overdueClass = "";
  if (task.date) {
    const due = new Date(task.date + 'T' + (task.time || '23:59'));
    const isToday = due.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === due.toDateString();
    const isOverdue = !task.done && due < now;

    if (isOverdue) {
      dueText = "⚠ Overdue";
      overdueClass = "overdue";
    } else if (isToday) {
      dueText = `Today ${task.time ? '· ' + formatTime(task.time) : ''}`;
    } else if (isTomorrow) {
      dueText = `Tomorrow ${task.time ? '· ' + formatTime(task.time) : ''}`;
    } else {
      dueText = formatDate(task.date) + (task.time ? ' · ' + formatTime(task.time) : '');
    }
  }

  const catEmoji = { Work: '💼', Personal: '🙂', Health: '💪', Shopping: '🛍', General: '📋' };

  li.innerHTML = `
    <div class="task-check" onclick="toggleDone(${index})">${task.done ? '✓' : ''}</div>
    <div class="task-body">
      <div class="task-name">${escapeHtml(task.text)}</div>
      <div class="task-meta">
        <span class="task-tag tag-${task.priority.toLowerCase()}">${task.priority}</span>
        ${dueText ? `<span class="task-due ${overdueClass}">📅 ${dueText}</span>` : ''}
        ${task.category ? `<span class="task-category-badge">${catEmoji[task.category] || '📁'} ${task.category}</span>` : ''}
      </div>
      ${task.note ? `<div class="task-note">💬 ${escapeHtml(task.note)}</div>` : ''}
    </div>
    <div class="task-actions">
      <button class="task-action-btn edit-btn" onclick="openEditModal(${index})" title="Edit">✏️</button>
      <button class="task-action-btn delete-btn" onclick="deleteTask(${index})" title="Delete">🗑</button>
    </div>
  `;

  return li;
}

// ── Add / Edit ─────────────────────────────────────────────
function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) { taskInput.focus(); taskInput.style.borderColor = 'var(--high)'; setTimeout(() => taskInput.style.borderColor = '', 800); return; }

  if (editingIndex !== null) {
    // Save edit
    tasks[editingIndex] = {
      ...tasks[editingIndex],
      text,
      date: taskDate.value,
      time: taskTime.value,
      priority: taskPriority.value,
      category: taskCategory.value,
      note: taskNote.value.trim(),
    };
    editingIndex = null;
    addBtnLabel.textContent = "+ Add Task";
    cancelBtn.style.display = "none";
  } else {
    tasks.push({
      text,
      date: taskDate.value,
      time: taskTime.value,
      priority: taskPriority.value,
      category: taskCategory.value,
      note: taskNote.value.trim(),
      done: false,
      added: Date.now(),
    });
  }

  clearForm();
  saveTasks();
  renderTasks();
}

function clearForm() {
  taskInput.value = "";
  taskDate.value = "";
  taskTime.value = "";
  taskPriority.value = "Low";
  taskCategory.value = "General";
  taskNote.value = "";
}

function cancelEdit() {
  editingIndex = null;
  clearForm();
  addBtnLabel.textContent = "+ Add Task";
  cancelBtn.style.display = "none";
}

// ── Inline edit (old path, now via modal) ─────────────────
function openEditModal(index) {
  const t = tasks[index];
  document.getElementById("modal-task").value = t.text;
  document.getElementById("modal-date").value = t.date || "";
  document.getElementById("modal-time").value = t.time || "";
  document.getElementById("modal-priority").value = t.priority;
  document.getElementById("modal-category").value = t.category || "General";
  document.getElementById("modal-note").value = t.note || "";

  document.getElementById("modal-overlay").classList.add("open");
  document.getElementById("modal-overlay").dataset.index = index;
}

function saveModal() {
  const index = parseInt(document.getElementById("modal-overlay").dataset.index);
  tasks[index] = {
    ...tasks[index],
    text: document.getElementById("modal-task").value.trim() || tasks[index].text,
    date: document.getElementById("modal-date").value,
    time: document.getElementById("modal-time").value,
    priority: document.getElementById("modal-priority").value,
    category: document.getElementById("modal-category").value,
    note: document.getElementById("modal-note").value.trim(),
  };
  closeModal();
  saveTasks();
  renderTasks();
}

function closeModal(e) {
  if (e && e.target !== document.getElementById("modal-overlay")) return;
  document.getElementById("modal-overlay").classList.remove("open");
}

// ── Actions ───────────────────────────────────────────────
function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

// ── Filter / Sort ─────────────────────────────────────────
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const titles = { all: 'All Tasks', active: 'Active', done: 'Completed', high: '🔴 High Priority', medium: '🟡 Medium Priority', low: '🟢 Low Priority' };
  document.getElementById("filter-title").textContent = titles[filter] || 'Tasks';

  renderTasks();
}

function setSort(sort, btn) {
  currentSort = sort;
  document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderTasks();
}

// ── Progress ──────────────────────────────────────────────
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  progressBar.style.width = pct + "%";
  progressLabel.textContent = `${done} of ${total} done`;
}

function updateCounts() {
  const c = {
    all: tasks.length,
    active: tasks.filter(t => !t.done).length,
    done: tasks.filter(t => t.done).length,
    high: tasks.filter(t => t.priority === 'High').length,
    medium: tasks.filter(t => t.priority === 'Medium').length,
    low: tasks.filter(t => t.priority === 'Low').length,
  };
  Object.entries(c).forEach(([k, v]) => {
    const el = document.getElementById("count-" + k);
    if (el) el.textContent = v;
  });
}

// ── Dark mode ─────────────────────────────────────────────
function toggleDarkMode() {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("dark-mode", darkToggle.checked ? "enabled" : "disabled");
}

// ── Auth ──────────────────────────────────────────────────
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// ── Helpers ───────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "";
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(str) {
  if (!str) return "";
  const [h, m] = str.split(":");
  const hh = parseInt(h);
  return `${hh % 12 || 12}:${m} ${hh >= 12 ? 'PM' : 'AM'}`;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Enter key to add task
taskInput.addEventListener("keydown", e => { if (e.key === "Enter") handleAdd(); });