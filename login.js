let currentTab = 'login';

function switchTab(tab) {
  currentTab = tab;
  const indicator = document.getElementById('tab-indicator');
  const btnLabel = document.getElementById('btn-label');
  const msg = document.getElementById('message');

  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');

  if (tab === 'register') {
    indicator.classList.add('right');
    btnLabel.textContent = 'Create Account';
  } else {
    indicator.classList.remove('right');
    btnLabel.textContent = 'Sign In';
  }

  msg.textContent = '';
  msg.className = 'message';
}

function handleMain() {
  if (currentTab === 'login') login();
  else register();
}

function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  if (!username || !password) {
    showMessage("Please fill in all fields", "error"); return;
  }
  if (password.length < 4) {
    showMessage("Password must be at least 4 characters", "error"); return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    showMessage("Username already taken", "error"); return;
  }

  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));
  showMessage("Account created! Signing you in…", "success");

  setTimeout(() => {
    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  }, 900);
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] === password) {
    showMessage("Welcome back! Loading…", "success");
    setTimeout(() => {
      localStorage.setItem("currentUser", username);
      window.location.href = "index.html";
    }, 700);
  } else {
    showMessage("Invalid username or password", "error");
    document.getElementById("password").value = "";
  }
}

function showMessage(text, type) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = 'message ' + type;
}

function togglePw() {
  const pw = document.getElementById("password");
  pw.type = pw.type === "password" ? "text" : "password";
}

// Allow Enter key
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleMain();
});