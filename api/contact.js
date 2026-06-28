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
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // Préparer l'e-mail de notification pour le propriétaire du site
  const mailToOwner = {
    from: `"Portfolio de Doriane" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: email, // Pour que la réponse aille au visiteur
    subject: `Nouveau message de ${name}: ${subject || 'Sans sujet'}`,
    html: `
      <p>Vous avez reçu un nouveau message depuis votre portfolio.</p>
      <hr>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${subject || 'Non spécifié'}</p>
      <p><strong>Message :</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  // Envoi de l'e-mail de notification
  try {
    await transporter.sendMail(mailToOwner);
    return res.status(200).json({ message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({ message: 'Le serveur a rencontré un problème lors de l\'envoi du message.' });
  }
}