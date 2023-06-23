const deleteUser = async (id) => {
  fetch(`/api/users/${id}`, {
    method: 'DELETE',
  })
    .then(() =>
      Swal.fire({
        icon: 'info',
        title: 'Usuario eliminado',
      })
    )
    .then((response) => (window.location.href = '/users'));
};

const changeRole = async (id) => {
  fetch(`/api/users/premium/${id}`, {
    method: 'PUT',
  })
    .then((response) => {
      if (response.status === 200) {
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo modificar este usuario',
          text: 'Intentelo nuevamente mas tarde',
        });
      }
    })
    .then((response) => (window.location.href = '/users'));
};

const deleteInactive = async () => {
  fetch(`/api/users`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status === 200) {
      alert('Usuarios eliminados');
    } else {
      alert('Ha habido un problema al eliminar usuarios');
    }
  });
};
