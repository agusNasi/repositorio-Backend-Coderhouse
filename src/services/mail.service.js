const { gmailTransport } = require('../config/tranports.config.js');

class MailService {
  async recoverPassword(userEmail, token, fullUrl) {
    if (!token) {
      throw new HttpError('Missing token', HTTP_STATUS.BAD_REQUEST);
    }
    if (!fullUrl) {
      throw new HttpError('Missing url', HTTP_STATUS.BAD_REQUEST);
    }
    const mailInfo = await gmailTransport.sendMail({
      from: 'E-commerce <agustinnasi49@gmail.com',
      to: userEmail,
      subject: 'Recuperación de contraseña',
      html: `
            <div>
                <h1>Recuperación de contraseña</h1>
                <p>Ingresa al siguiente enlace para restaurar tu contraseña</p>
                <a href=${fullUrl + '?token=' + token} >Click aqui</a>
                <p>ignora este correo electrónico si no lo enviaste</p>
            </div>`,
      attachments: [],
    });
    return mailInfo;
  }

  async notifyDeletion(userEmail, userName) {
    const mailInfo = await gmailTransport.sendMail({
      from: 'E-commerce <agustinnasi49@gmail.com',
      to: userEmail,
      subject: '¡Te extrañaremos!',
      html: `
            <div>
                <h1>Su cuenta ha sido desactivada</h1>
                <p>Estimado ${userName}, lamentamos informarle que su cuenta ha sido cerrada debido a la inactividad. Nuestras puertas siempre están abiertas si desea volver a registrarse. ¡Hasta la próxima!</p>
                <p>E-commerce team</p>
            </div>`,
      attachments: [],
    });
    return mailInfo;
  }

  async productDeletion(userEmail, productTitle) {
    const mailInfo = await gmailTransport.sendMail({
      from: 'E-commerce <agustinnasi49@gmail.com',
      to: userEmail,
      subject: 'Notificación de eliminación de producto',
      html: `
            <div>
                <h1>Se ha eliminado un producto de su propiedad: ${productTitle}</h1>
                <p>E-commerce team</p>
            </div>`,
      attachments: [],
    });
    return mailInfo;
  }
}

module.exports = MailService;
