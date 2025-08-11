const nodemailer = require('nodemailer');

// SMTP transporter oluştur
const transporter = nodemailer.createTransport({
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
      
      <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="color: #0e2323; font-size: 12px; margin: 0; font-weight: bold;">
          HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
        </p>
        <p style="color: #6c757d; font-size: 11px; margin: 5px 0;">
          📍 AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR | 📞 0232 905 55 55 | 📧 info@hoowell.com.tr
        </p>
        <p style="color: #6c757d; font-size: 11px; margin: 5px 0 0 0;">
          Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
        </p>
      </div>
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
      
      <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="color: #0e2323; font-size: 12px; margin: 0; font-weight: bold;">
          HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
        </p>
        <p style="color: #6c757d; font-size: 11px; margin: 5px 0;">
          📍 AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR | 📞 0232 905 55 55 | 📧 info@hoowell.com.tr
        </p>
        <p style="color: #6c757d; font-size: 11px; margin: 5px 0 0 0;">
          Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
        </p>
      </div>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

// Yeni kayıt sistemi hoş geldin emaili
const sendNewRegistrationEmail = async (user, password) => {
  const subject = 'HOOWELL - Kayıt İşleminiz Tamamlandı!';
  const registrationTypeText = user.registration_type === 'individual' ? 'Bireysel' : 'Kurumsal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0e2323 0%, #1a4a3a 50%, #0e2323 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: #FFD700; font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
          HOOWELL
        </h1>
        <p style="color: #fff; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">
          INNOVATE YOUR LIFE
        </p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px; background-color: #fff;">
        <h2 style="color: #0e2323; margin-bottom: 20px;">
          🎉 Hoş Geldiniz ${user.first_name}!
        </h2>
        
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          HOOWELL ailesine katıldığınız için teşekkür ederiz. ${registrationTypeText} kayıt işleminiz başarıyla tamamlanmıştır.
        </p>
        
        <!-- Registration Info -->
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #FFD700;">
          <h3 style="color: #0e2323; margin-top: 0;">📋 Kayıt Bilgileriniz</h3>
          <p><strong>Kayıt Türü:</strong> ${registrationTypeText}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Sponsor ID:</strong> ${user.sponsor_id}</p>
          <p><strong>Toplam Tutar:</strong> ${user.total_amount} ₺</p>
        </div>
        
        <!-- Login Info -->
        <div style="background-color: #e8f5e8; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #0e2323; margin-top: 0;">🔐 Giriş Bilgileriniz</h3>
          <p><strong>Kullanıcı Adı:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Geçici Şifre:</strong> <code style="background-color: #fff; padding: 4px 8px; border-radius: 4px; color: #dc3545; font-weight: bold;">${password}</code></p>
        </div>
        
        <!-- Next Steps -->
        <div style="background-color: #fff3cd; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #0e2323; margin-top: 0;">📝 Sonraki Adımlar</h3>
          <ol style="color: #333; line-height: 1.8;">
            <li><strong>Ödeme İşlemi:</strong> Kayıt ücretinizi ödemek için sisteme giriş yapın</li>
            <li><strong>Eğitim Süreci:</strong> Ödeme onaylandıktan sonra 7 gün içinde eğitimlerinizi tamamlayın</li>
            <li><strong>Web Ofis:</strong> Eğitimler tamamlandıktan sonra web ofisiniz aktif hale gelecek</li>
          </ol>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/login" 
             style="background: linear-gradient(135deg, #FFD700, #FFA500); 
                    color: #0e2323; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold; 
                    font-size: 16px;
                    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);">
            💳 SİSTEME GİRİŞ YAP
          </a>
        </div>
        
        <!-- Important Note -->
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #dc3545;">
          <p style="color: #721c24; margin: 0; font-weight: bold;">
            ⚠️ Önemli: Güvenliğiniz için ilk girişinizde şifrenizi değiştirmeyi unutmayın!
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0e2323; padding: 20px; text-align: center;">
        <p style="color: #FFD700; margin: 0; font-size: 14px;">
          HOOWELL GLOBAL ALKALİ İYONİZER SİSTEMLERİ ANONİM ŞİRKETİ
        </p>
        <p style="color: #ccc; margin: 5px 0; font-size: 12px;">
          📍 AOSB MAH. 10035 SK. NO 5 ÇİĞİLİ İZMİR
        </p>
        <p style="color: #ccc; margin: 5px 0; font-size: 12px;">
          📞 0232 905 55 55 | 📧 info@hoowell.com.tr
        </p>
        <p style="color: #ccc; margin: 5px 0 0 0; font-size: 12px;">
          Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
        </p>
      </div>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNewRegistrationEmail
};