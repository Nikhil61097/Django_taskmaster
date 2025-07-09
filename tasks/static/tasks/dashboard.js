document.addEventListener('DOMContentLoaded', async () => {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    alert('You are not logged in. Redirecting to login...');
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch('/api/tasks/', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch failed:', errorText);
      alert('Failed to fetch tasks.\n\nDetails:\n' + errorText);
      return;  // 🔁 DO NOT redirect immediately, let dev debug
    }

    const tasks = await response.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.title} — ${task.completed ? '✅' : '❌'} (Assigned to: ${task.username || 'Unassigned'})`;
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