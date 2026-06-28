import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // On ne traite que les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Seules les requêtes POST sont autorisées' });
  }

  const { name, email, subject, message } = req.body;

  // Validation simple des entrées
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Configuration du transporteur d'e-mail (ici, avec Gmail)
  // Les identifiants sont stockés dans les variables d'environnement sur Vercel
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Votre adresse Gmail
      pass: process.env.EMAIL_PASS, // Votre mot de passe d'application Gmail
    },
  });

  try {
    // Envoi de l'e-mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // L'expéditeur apparaît comme le nom du visiteur
      to: process.env.RECIPIENT_EMAIL, // L'adresse de votre cliente
      replyTo: email, // Permet de répondre directement au visiteur
      subject: `Message du Portfolio : ${subject}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Nouveau message depuis le Portfolio</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <hr>
          <h3>Message :</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    // Succès
    return res.status(200).json({ message: 'Message envoyé avec succès' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de l'envoi de l'e-mail." });
  }
}