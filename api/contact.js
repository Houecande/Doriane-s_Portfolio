import nodemailer from 'nodemailer';

// La fonction principale qui sera exécutée par Vercel
export default async function handler(req, res) {
  // On s'assure que la requête est bien de type POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Seule la méthode POST est autorisée' });
  }

  const { name, email, subject, message } = req.body;

  // Validation simple des données reçues
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Le nom, l\'email et le message sont requis.' });
  }

  // Configuration du transporteur d'e-mail (ici, avec Gmail)
  // Les identifiants sont stockés dans les variables d'environnement de Vercel
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Votre adresse Gmail
      pass: process.env.EMAIL_PASS, // Votre mot de passe d'application Gmail
    },
  });

  // Contenu de l'e-mail que vous recevrez
  const mailOptions = {
    from: `"${name}" <${email}>`, // L'expéditeur sera la personne qui a rempli le formulaire
    to: process.env.EMAIL_USER,   // L'e-mail est envoyé à vous-même
    subject: `Nouveau message de portfolio: ${subject || 'Sans sujet'}`,
    html: `
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${subject || 'Non spécifié'}</p>
      <hr>
      <p><strong>Message :</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  // Envoi de l'e-mail
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({ message: 'Le serveur a rencontré un problème lors de l\'envoi du message.' });
  }
}