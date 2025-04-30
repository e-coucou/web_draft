window.onload = async () => {
    try {
      const response = await api.get('/dashboard-data');
      document.getElementById('userData').innerText = `Bienvenue ${response.data.message}`;
    } catch (error) {
      window.location.href = '/login.html';
    }
  };
  