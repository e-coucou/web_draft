document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
  
    if (data.success) {
      localStorage.setItem('accessToken', data.accessToken);
      alert('Connexion réussie !');
      // Redirection éventuelle ici
    } else {
      alert(data.message);
    }
  });
  