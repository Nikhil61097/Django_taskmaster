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
      return;
    }

    const data = await response.json();
    const accessToken = data.access;
    const refreshToken = data.refresh;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // Decode JWT payload
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const isStaff = payload.is_staff;

    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Login successful! Redirecting...';

    if (isStaff) {
      window.location.href = '/manager/';
    } else {
      window.location.href = '/dashboard/';
    }
  } catch (err) {
    messageDiv.textContent = 'Error: ' + err.message;
  }
});
