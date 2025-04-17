import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendReservationEmail = async (
  email: string,
  carDetails: {
    brand: string;
    model: string;
    reservedFrom: Date;
    reservedTo: Date;
    customerName: string;
  }
) => {
  const formattedFromDate = new Date(carDetails.reservedFrom).toLocaleDateString('fr-FR');
  const formattedToDate = new Date(carDetails.reservedTo).toLocaleDateString('fr-FR');

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Confirmation de votre réservation - Alliby Rental',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #e63946;">🚗 Confirmation de réservation - Alliby Rental</h1>
        <p>Bonjour <strong>${carDetails.customerName}</strong>,</p>

        <p>Nous vous confirmons votre réservation effectuée chez <strong>Alliby Rental</strong>.</p>

        <h2>Détails de la réservation :</h2>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Véhicule :</strong> ${carDetails.brand} ${carDetails.model}</li>
          <li><strong>Du :</strong> ${formattedFromDate}</li>
          <li><strong>Au :</strong> ${formattedToDate}</li>
        </ul>

        <p style="margin-top: 20px;">Nous vous remercions pour votre confiance.</p>
        <p>L’équipe <strong>Alliby Rental</strong> reste à votre disposition 🚘</p>

        <hr style="margin-top: 40px;">
        <p style="font-size: 12px; color: #888;">Cet email est généré automatiquement, merci de ne pas y répondre.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation envoyé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi de l’email :', error);
    throw new Error('Échec de l’envoi de l’email de confirmation');
  }
};
