document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/';
    return;
  }

  const taskList = document.getElementById('task-list');
  const form = document.getElementById('task-form');
  const taskIdInput = document.getElementById('task-id');
  const titleInput = document.getElementById('task-title');
  const completedInput = document.getElementById('task-completed');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const descriptionInput = document.getElementById('task-description');

  // Fetch and display tasks
  async function loadTasks() {
    taskList.innerHTML = '';
    try {
      const res = await fetch('/api/tasks/', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Failed to load tasks');
      const tasks = await res.json();
      tasks.forEach(addTaskToList);
    } catch (e) {
      alert(e.message);
    }
  }

  // Add a task item to the list with Edit button
function addTaskToList(task) {
  const li = document.createElement('li');
  li.style.marginBottom = '10px';

  const taskText = document.createElement('span');
  taskText.textContent = `${task.title} - ${task.description} ${task.completed ? '✅' : '❌'}`;
  taskText.style.cursor = 'pointer';
  taskText.style.marginRight = '10px';

  taskText.addEventListener('click', () => {
    taskIdInput.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    completedInput.checked = task.completed;
    cancelEditBtn.style.display = 'inline';
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.onclick = async () => {
    if (!confirm('Delete this task?')) return;

    const res = await fetch(`/api/tasks/${task.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });

    if (res.ok) {
      loadTasks();
    } else {
      alert('Failed to delete task');
    }
  };

  li.appendChild(taskText);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

  // Clear form and editing state
  function clearForm() {
    taskIdInput.value = '';
    titleInput.value = '';
    completedInput.checked = false;
    cancelEditBtn.style.display = 'none';
  }

  // Submit form handler for create/edit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const id = taskIdInput.value;
    const url = id ? `/api/tasks/${id}/` : '/api/tasks/';
    const method = id ? 'PUT' : 'POST';

    const body = JSON.stringify({
      title: titleInput.value,
      description: descriptionInput.value,
      completed: completedInput.checked
    });

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body
      });
      if (!res.ok) throw new Error('Failed to save task');
      clearForm();
      loadTasks();
    } catch (e) {
      alert(e.message);
    }
  });

  cancelEditBtn.addEventListener('click', e => {
    e.preventDefault();
    clearForm();
  });

  // Logout function
  window.logout = function() {
    localStorage.clear();
    window.location.href = '/';
  };

  loadTasks();
});
