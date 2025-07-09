// -------------------- Utilities --------------------

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

function logout() {
  window.location.href = '/logout/';
}

async function fetchWithAuth(url, options = {}) {
  options.credentials = 'include'; // For session auth
  return fetch(url, options);
}

// -------------------- Load Users --------------------

async function loadUsers() {
  const res = await fetchWithAuth('/api/users/');
  if (!res.ok) {
    alert('Failed to load users');
    return;
  }

  const users = await res.json();
  const userList = document.getElementById('user-list');
  const taskUserDropdown = document.getElementById('task-user');
  const editUserInput = document.getElementById('edit-task-user-id');

  userList.innerHTML = '';
  taskUserDropdown.innerHTML = '<option value="">Select a user</option>';
  editUserInput.innerHTML = '<option value="">Unassigned</option>';

  userIdToName = {}; // reset mapping

  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.username} (id: ${user.id})`;

    // Delete button for user
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = () => deleteUser(user.id);
    li.appendChild(deleteBtn);

    userList.appendChild(li);

    const opt1 = document.createElement('option');
    opt1.value = user.id;
    opt1.textContent = user.username;
    taskUserDropdown.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = user.id;
    opt2.textContent = user.username;
    editUserInput.appendChild(opt2.cloneNode(true));

    userIdToName[user.id] = user.username;
  });
}

// -------------------- Task Functions --------------------

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
    const username = task.user ? (userIdToName[task.user] || 'Unknown') : 'Unassigned';

    li.innerHTML = `
      ${task.title} — ${task.completed ? '✅' : '❌'}
      (User: ${username})
    `;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.marginLeft = '10px';
    editBtn.onclick = () => showEditForm(task);
    li.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = () => deleteTask(task.id);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

async function createTask(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const completed = document.getElementById('task-completed').checked;
  const userId = document.getElementById('task-user').value;

  const body = { title, completed };
  if (userId) body.user = userId;

  const res = await fetch('/api/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert('Task created');
    loadTasks();
  } else {
    const err = await res.json();
    alert('Error: ' + JSON.stringify(err));
  }
}

// -------------------- Edit Task --------------------

function showEditForm(task) {
  document.getElementById('edit-section').style.display = 'block';
  document.getElementById('edit-task-id').value = task.id;
  document.getElementById('edit-task-title').value = task.title;
  document.getElementById('edit-task-completed').checked = task.completed;

  const dropdown = document.getElementById('edit-task-user-id');
  for (let option of dropdown.options) {
    option.selected = (option.value === String(task.user));
  }
}

async function submitEditForm(e) {
  e.preventDefault();

  const taskId = document.getElementById('edit-task-id').value;
  const title = document.getElementById('edit-task-title').value;
  const completed = document.getElementById('edit-task-completed').checked;
  const user = document.getElementById('edit-task-user-id').value;

  const body = { title, completed };
  if (user !== '') {
    body.user = user;
  } else {
    body.user = null;
  }

  const res = await fetchWithAuth(`/api/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert('Task updated');
    document.getElementById('edit-section').style.display = 'none';
    loadTasks();
  } else {
    const err = await res.json();
    alert('Update failed: ' + JSON.stringify(err));
  }
}

// -------------------- Delete Functions --------------------

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  const res = await fetch(`/api/users/${userId}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'include'
  });

  if (res.ok) {
    alert('User deleted');
    loadUsers();
    loadTasks(); // reload tasks as some may belong to deleted user
  } else {
    const err = await res.json();
    alert('Failed to delete user: ' + (err.detail || JSON.stringify(err)));
  }
}

async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  const res = await fetch(`/api/tasks/${taskId}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'include'
  });

  if (res.ok) {
    alert('Task deleted');
    loadTasks();
  } else {
    const err = await res.json();
    alert('Failed to delete task: ' + (err.detail || JSON.stringify(err)));
  }
}

// -------------------- Create User --------------------

async function createUser(e) {
  e.preventDefault();
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;

  const res = await fetch('/api/create-user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert('User created');
    loadUsers();
  } else {
    const data = await res.json();
    alert('Error: ' + (data.error || 'Unknown'));
  }
}

// -------------------- Event Bindings --------------------

document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('create-user-form').addEventListener('submit', createUser);
document.getElementById('create-task-form').addEventListener('submit', createTask);
document.getElementById('edit-task-form').addEventListener('submit', submitEditForm);

// -------------------- Initial Load --------------------

loadUsers();
loadTasks();
