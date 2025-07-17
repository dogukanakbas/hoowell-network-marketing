const nodemailer = require('nodemailer');

// SMTP transporter oluştur
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email gönderme fonksiyonu
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Hoş geldin emaili
const sendWelcomeEmail = async (user, password) => {
  const subject = 'Hoowell Network Marketing - Hesabınız Oluşturuldu';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Hoş Geldiniz ${user.first_name}!</h2>
      <p>Hoowell Network Marketing sistemine hoş geldiniz. Hesabınız başarıyla oluşturulmuştur.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Giriş Bilgileriniz:</h3>
        <p><strong>Kullanıcı Adı:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Şifre:</strong> ${password}</p>
      </div>
      
      <p>Güvenliğiniz için ilk girişinizde şifrenizi değiştirmenizi öneririz.</p>
      
      <a href="http://localhost:3000" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sisteme Giriş Yap</a>
      
      <p style="margin-top: 30px; color: #6c757d; font-size: 12px;">
        Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
      </p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

// Şifre sıfırlama emaili
const sendPasswordResetEmail = async (user, resetToken) => {
  const subject = 'Hoowell Network Marketing - Şifre Sıfırlama';
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Şifre Sıfırlama Talebi</h2>
      <p>Merhaba ${user.first_name},</p>
      <p>Şifre sıfırlama talebiniz alınmıştır. Aşağıdaki linke tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
      
      <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Şifremi Sıfırla</a>
      
      <p style="margin-top: 20px;">Bu link 1 saat geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız bu emaili görmezden gelebilirsiniz.</p>
      
      <p style="margin-top: 30px; color: #6c757d; font-size: 12px;">
        Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
      </p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};