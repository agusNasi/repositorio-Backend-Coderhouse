const form = document.getElementById('new-password-form');

const showError = (messsage) => {
  const errorTag = document.createElement('div');
  errorTag.classList.add('error-message');
  errorTag.textContent = messsage;
  form.parentElement.parentElement.appendChild(errorTag);
};

const showRedirectButton = () => {
  const redirectButton = document.createElement('button');
  redirectButton.innerHTML = `
    <a href='/login/recover'>Nuevo email de recuperacion</a>
    `;
  form.parentElement.parentElement.appendChild(redirectButton);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = new URLSearchParams(formData);
  const requestOptions = {
    method: 'PUT',
    body: payload,
  };
  fetch('/api/users/generatenewpassword', requestOptions)
    .then((response) => {
      switch (response.status) {
        case 200:
          console.log(response);
          window.location.href = '/login';
          break;
        case 400:
          showError(
            'La nueva contraseña no puede ser igual a la anterior. Por favor, elige uno nuevo'
          );
          break;
        case 403:
          showError(
            'El token ha caducado, haga clic a continuación para enviar un nuevo correo electrónico de recuperación'
          );
          showRedirectButton();
          break;
        default:
          break;
      }
    })
    .catch((error) => console.log(error));
});
