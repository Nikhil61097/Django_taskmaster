document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/tasks/', {
      credentials: 'include', // important to send session cookie
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch failed:', errorText);
      alert('Failed to fetch tasks.\n\nDetails:\n' + errorText);
      return;
    }

    const tasks = await response.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.title} — ${task.completed ? '✅' : '❌'} (Assigned to: You)`;
      taskList.appendChild(li);
    });
  } catch (err) {
    console.error('Network or JS error:', err);
    alert('Unexpected error:\n' + err.message);
  }
});

function getCSRFToken() {
  let cookieValue = null;
  const name = 'csrftoken';
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
document.getElementById('logout-btn').addEventListener('click', logout);

function logout() {
  window.location.href = '/logout/';
}