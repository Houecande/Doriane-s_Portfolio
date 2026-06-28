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

  // 1. Préparer l'e-mail de notification pour VOUS (le propriétaire)
  const mailToOwner = {
    from: `"Portfolio de Doriane" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL, // L'e-mail est envoyé
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

  // 2. Préparer l'e-mail de confirmation pour le VISITEUR
  const mailToVisitor = {
    from: `"Doriane" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirmation de réception de votre message',
    html: `
      <p>Bonjour ${name},</p>
      <p>Merci de m'avoir contactée. J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.</p>
      <br>
      <p>Cordialement,</p>
      <p>Doriane</p>
      <hr>
      <p style="font-size:0.9em; color:#666;">Rappel de votre message : <em>"${message.substring(0, 100)}..."</em></p>
    `,
  };

  // Envoi des deux e-mails
  try {
    await transporter.sendMail(mailToOwner);
    await transporter.sendMail(mailToVisitor);
    return res.status(200).json({ message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({ message: 'Le serveur a rencontré un problème lors de l\'envoi du message.' });
  }
}