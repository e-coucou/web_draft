document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
  
    const response = await fetch('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  
    const data = await response.json();
  
    if (data.success) {
      alert('Email de réinitialisation envoyé.');
      window.location.href = '/index.html';
    } else {
      alert(data.message);
    }
  });
  