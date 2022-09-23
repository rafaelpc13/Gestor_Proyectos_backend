

import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
  const { email, nombre, token,apellido } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //informacino del email

  const info = await transport.sendMail({
    from: '"Administrador de Proyectos"<gestor-proyectos@outlook.com>',
    to: email,
    subject: "comprueba tu cuenta",
    text: "comprueba tu cuenta en Gestor proyectos",
    html: `<p>hola:${nombre+" "+apellido} Comprueba tu cuenta</p>
<p>Tu cuenta ya esta casi lista,solo debes comprobarla en el siguiente enlace:
<a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
<p>Si tu no creaste esta cuenta ,puedes ignorar el mensaje</p>
`
  })
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token,apellido } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //informacino del email

  const info = await transport.sendMail({
    from: '"Administrador de Proyectos"<gestor@proyectos.com>',
    to: email,
    subject: "Reestablece tu password",
    text: "Reestablece tu password en Gestor proyectos",
    html: `<p>hola:${nombre+" "+apellido} has solicitado Reestablecer tu password</p>
  <p>Genera tu nuevo password en el siguiente enlace:
  <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
  <p>Si tu no solicitaste este email,puedes ignorar el mensaje</p>
  `,
  });
};