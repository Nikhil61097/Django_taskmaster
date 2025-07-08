document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');
  if (!token) return (window.location.href = '/');

  const userForm = document.getElementById('user-form');
  const taskForm = document.getElementById('task-form');
  const userSelect = document.getElementById('user-select');
  const taskList = document.getElementById('task-list');

  // Fetch all users for the dropdown
  async function loadUsers() {
    const res = await fetch('/api/users/', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const users = await res.json();
    userSelect.innerHTML = '';
    users.forEach(user => {
      const opt = document.createElement('option');
      opt.value = user.id;
      opt.textContent = user.username;
      userSelect.appendChild(opt);
    });
  }

  // Fetch all tasks (manager can see all)
  async function loadTasks() {
    const res = await fetch('/api/tasks/', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const tasks = await res.json();
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `(${task.user}) ${task.title} - ${task.description} ${task.completed ? '✅' : '❌'}`;
      taskList.appendChild(li);
    });
  }

  // Submit new user
  userForm.addEventListener('submit', async e => {
    e.preventDefault();

    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    const res = await fetch('/api/create-user/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      alert('User created!');
      userForm.reset();
      loadUsers();
    } else {
      alert('Failed to create user');
    }
  });

  // Submit new task
  taskForm.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
      title: document.getElementById('task-title').value,
      description: document.getElementById('task-desc').value,
      completed: document.getElementById('task-completed').checked,
      user: userSelect.value
    };

    const res = await fetch('/api/tasks/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Task created!');
      taskForm.reset();
      loadTasks();
    } else {
      alert('Failed to assign task');
    }
  });

  window.logout = function () {
    localStorage.clear();
    window.location.href = '/';
  };

  // Init load
  loadUsers();
  loadTasks();
});
