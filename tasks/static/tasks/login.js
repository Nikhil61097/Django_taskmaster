document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');

  try {
    const response = await fetch('/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      messageDiv.textContent = 'Login failed: ' + (errorData.detail || 'Unknown error');
      messageDiv.style.color = 'red';
      return;
    }

    const data = await response.json();
    const accessToken = data.access;
    const refreshToken = data.refresh;

    // Save tokens in localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // Decode JWT payload to check role
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const isStaff = payload.is_staff;

    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Login successful! Redirecting...';

    // Manual redirection: always override ?next
    if (isStaff) {
      window.location.href = '/manager/';
    } else {
      window.location.href = '/dashboard/';
    }
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
    messageDiv.style.color = 'red';
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