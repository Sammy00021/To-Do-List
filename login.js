function register() {

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if(username === "" || password === ""){
document.getElementById("message").textContent = "Enter username and password";
return;
}

let users = JSON.parse(localStorage.getItem("users")) || {};

if(users[username]){
document.getElementById("message").textContent = "User already exists";
return;
}

users[username] = password;

localStorage.setItem("users", JSON.stringify(users));

document.getElementById("message").textContent = "Registered successfully";
}

function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

let users = JSON.parse(localStorage.getItem("users")) || {};

if(users[username] === password){

localStorage.setItem("currentUser", username);

window.location.href = "index.html";

}else{
document.getElementById("message").textContent = "Invalid login";
}

}