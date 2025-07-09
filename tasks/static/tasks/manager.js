// Helper: Get CSRF token from cookies
function getCSRFToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return '';
}

// Logout function
function logout() {
  window.location.href = '/logout/';
}

// Reusable authenticated fetch wrapper (only for GET requests)
async function fetchWithAuth(url, options = {}) {
  options.credentials = 'include'; // Important for session-based auth
  return fetch(url, options);
}

// Load all users (for manager view)
async function loadUsers() {
  const res = await fetchWithAuth('/api/users/');
  if (!res.ok) {
    alert('Failed to load users');
    return;
  }

  const users = await res.json();
  const list = document.getElementById('user-list');
  const dropdown = document.getElementById('task-user');

  list.innerHTML = '';
  dropdown.innerHTML = '<option value="">Select a user</option>';

  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.username} (id: ${user.id})`;
    list.appendChild(li);

    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.username;
    dropdown.appendChild(option);
  });
}

// Create a new user
async function createUser(e) {
  e.preventDefault();
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;

  const res = await fetch('/api/create-user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    alert('User created');
    loadUsers();
  } else {
    const data = await res.json();
    alert('Error: ' + (data.error || 'Unknown'));
  }
}

// Load all tasks (manager sees all)
async function loadTasks() {
  const res = await fetchWithAuth('/api/tasks/');
  if (!res.ok) {
    alert('Failed to load tasks');
    return;
  }

  const tasks = await res.json();
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.title} — ${task.completed ? '✅' : '❌'} (User ID: ${task.user || 'Unassigned'})`;
    list.appendChild(li);
  });
}

// Create a new task (with optional user)
async function createTask(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const completed = document.getElementById('task-completed').checked;
  const userId = document.getElementById('task-user').value;

  const body = {
    title: title,
    completed: completed,
  };

  if (userId) {
    body.user = userId;
  }

  const res = await fetch('/api/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert('Task created');
    loadTasks();
  } else {
    const data = await res.json();
    alert('Error: ' + JSON.stringify(data));
  }
}

// Event bindings
document.getElementById('create-user-form').addEventListener('submit', createUser);
document.getElementById('create-task-form').addEventListener('submit', createTask);
document.getElementById('logout-btn').addEventListener('click', logout);

// Initial load
loadUsers();
loadTasks();
