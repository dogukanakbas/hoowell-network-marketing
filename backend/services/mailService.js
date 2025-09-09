const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 1. MÜŞTERİ HOŞ GELDİN MAİLİ (Cihaz Satışı)
const sendCustomerWelcomeEmail = async (customerData, sellerData) => {
  const msg = {
    to: customerData.email,
    from: 'info@hoowell.net',
    subject: 'Hoowell Ailesine Hoş Geldiniz!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #007bff; margin: 0;">🎉 HOOWELL Ailesine Hoş Geldiniz!</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Sizi aramızda görmekten çok mutluyuz.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="color: #007bff; margin-top: 0;">📦 SATIŞ BİLGİLERİNİZ</h3>
          <p><strong>Satın Alınan Cihaz:</strong> ${customerData.product_name}</p>
          <p><strong>Satış Tarihi:</strong> ${customerData.sale_date}</p>
          <p><strong>Satış Bedeli:</strong> ${customerData.total_amount} TL</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">👤 SATICI BİLGİLERİNİZ</h3>
          <p><strong>Adı:</strong> ${sellerData.first_name} ${sellerData.last_name}</p>
          <p><strong>İş Ortağı Numarası:</strong> ${sellerData.sponsor_id}</p>
          <p><strong>Telefon:</strong> ${sellerData.phone}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">📞 HOOWELL MÜŞTERİ HİZMETLERİNE ULAŞIN</h3>
          <p><strong>Email:</strong> mhizmetleri@hoowell.net</p>
          <p><strong>Telefon:</strong> *** *** ** **</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Customer welcome email sent to:', customerData.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Customer welcome email error:', error);
    return { success: false, error: error.message };
  }
};

// 2. SATICI BİLDİRİM MAİLİ (Cihaz Satışı)
const sendSellerNotificationEmail = async (sellerData, customerData) => {
  const msg = {
    to: sellerData.email,
    from: 'info@hoowell.net',
    subject: 'Yeni Satışınız İçin Tebrikler!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #28a745; margin: 0;">🎯 Yeni Satışınız İçin Tebrikler!</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Sizi yaptığınız satış için tebrik ediyoruz.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">👤 YENİ MÜŞTERİNİZİN BİLGİLERİ</h3>
          <p><strong>Adı:</strong> ${customerData.first_name} ${customerData.last_name}</p>
          <p><strong>Telefon:</strong> ${customerData.phone}</p>
          <p><strong>Email:</strong> ${customerData.email}</p>
          <p><strong>Adres:</strong> ${customerData.address}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="color: #007bff; margin-top: 0;">💰 SATIŞ DETAYLARI</h3>
          <p><strong>Satın Alınan Cihaz:</strong> ${customerData.product_name}</p>
          <p><strong>Satış Bedeli:</strong> ${customerData.total_amount} TL</p>
          <p><strong>KKP Kazancınız:</strong> ${customerData.kkp_points} puan</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Seller notification email sent to:', sellerData.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Seller notification email error:', error);
    return { success: false, error: error.message };
  }
};

// 3. İŞ ORTAĞI HOŞ GELDİN MAİLİ
const sendPartnerWelcomeEmail = async (partnerData, sponsorData) => {
  const msg = {
    to: partnerData.email,
    from: 'info@hoowell.net',
    subject: 'Hoowell Ailesine Hoş Geldiniz!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #007bff; margin: 0;">🎉 HOOWELL Ailesine Hoş Geldiniz!</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Sizi kararınızdan dolayı tebrik ediyoruz.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">👥 SPONSOR BİLGİLERİNİZ</h3>
          <p><strong>Adı:</strong> ${sponsorData.first_name} ${sponsorData.last_name}</p>
          <p><strong>İş Ortağı Numarası:</strong> ${sponsorData.sponsor_id}</p>
          <p><strong>Telefon:</strong> ${sponsorData.phone}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="color: #007bff; margin-top: 0;">🔑 HESAP BİLGİLERİNİZ</h3>
          <p><strong>Adı:</strong> ${partnerData.first_name} ${partnerData.last_name}</p>
          <p><strong>İş Ortağı Numarası:</strong> ${partnerData.sponsor_id}</p>
          <p><strong>Geçici Şifreniz:</strong> ${partnerData.temp_password}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">🎓 HESABINIZA VE TEMEL EĞİTİMLERİNİZE BURADAN ULAŞIN</h3>
          <div style="text-align: center; margin-top: 15px;">
            <a href="https://hoowell.net/login" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Giriş Yap</a>
          </div>
        </div>
        
        <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
          <h3 style="color: #0c5460; margin-top: 0;">📞 HOOWELL MÜŞTERİ HİZMETLERİNE ULAŞIN</h3>
          <p><strong>Email:</strong> mhizmetleri@hoowell.net</p>
          <p><strong>Telefon:</strong> *** *** ** **</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Partner welcome email sent to:', partnerData.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Partner welcome email error:', error);
    return { success: false, error: error.message };
  }
};

// 4. SPONSOR BİLDİRİM MAİLİ
const sendSponsorNotificationEmail = async (sponsorData, newPartnerData) => {
  const msg = {
    to: sponsorData.email,
    from: 'info@hoowell.net',
    subject: 'Yeni İş Ortağınız İçin Tebrikler!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #28a745; margin: 0;">🎯 Yeni İş Ortağınız İçin Tebrikler!</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Sizi işinizi büyüttüğünüz için tebrik ediyoruz.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">👤 YENİ İŞ ORTAĞINIZIN HESAP BİLGİLERİ</h3>
          <p><strong>Adı:</strong> ${newPartnerData.first_name} ${newPartnerData.last_name}</p>
          <p><strong>İş Ortağı Numarası:</strong> ${newPartnerData.sponsor_id}</p>
          <p><strong>Telefonu:</strong> ${newPartnerData.phone}</p>
          <p><strong>Email:</strong> ${newPartnerData.email}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="color: #007bff; margin-top: 0;">📊 TAKİP VE DESTEK</h3>
          <p>Yeni ortağınızın eğitim sürecini takip edebilir ve destekleyebilirsiniz.</p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="https://hoowell.net/dashboard" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Dashboard'a Git</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Sponsor notification email sent to:', sponsorData.email);
    return { success: true };
  } catch (error) {
    console.error('❌ Sponsor notification email error:', error);
    return { success: false, error: error.message };
  }
};

// 5. MUHASEBE RAPORU MAİLİ (Şahıs Alışverişi)
const sendAccountingReportEmail = async (accountingData) => {
  const msg = {
    to: 'muhasebe@hoowell.net',
    from: 'info@hoowell.net',
    subject: `Muhasebe Raporu - ${accountingData.sale_date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc3545; margin: 0;">📊 MUHASEBE RAPORU</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #dc3545; margin-top: 0;">📅 SATIŞ BİLGİLERİ</h3>
          <p><strong>Satış Tarihi:</strong> ${accountingData.sale_date}</p>
          <p><strong>Müşteri ID:</strong> ${accountingData.customer_id}</p>
          <p><strong>İş Ortağı ID:</strong> ${accountingData.seller_id}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">👤 SATIN ALAN KİŞİ</h3>
          <p><strong>Adı:</strong> ${accountingData.customer_name}</p>
          <p><strong>Soyadı:</strong> ${accountingData.customer_surname}</p>
          <p><strong>Telefon:</strong> ${accountingData.customer_phone}</p>
          <p><strong>Email:</strong> ${accountingData.customer_email}</p>
          <p><strong>Adres:</strong> ${accountingData.customer_address}</p>
          <p><strong>İlçe:</strong> ${accountingData.customer_district}</p>
          <p><strong>İl:</strong> ${accountingData.customer_city}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">💰 ÜRÜN VE FİYAT BİLGİLERİ</h3>
          <p><strong>Ürün:</strong> ${accountingData.product_name}</p>
          <p><strong>KKP Değeri:</strong> ${accountingData.kkp_value}</p>
          <p><strong>Fiyatı:</strong> ${accountingData.product_price} TL</p>
          <p><strong>KDV:</strong> %${accountingData.tax_rate}</p>
          <p><strong>Satış Bedeli:</strong> ${accountingData.sale_amount} TL</p>
          <p><strong>Miktar:</strong> ${accountingData.quantity}</p>
          <p><strong>Toplam Bedel:</strong> ${accountingData.total_amount} TL</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
          <h3 style="color: #0c5460; margin-top: 0;">💳 ÖDEME BİLGİLERİ</h3>
          <p><strong>Ödeme Şekli:</strong> ${accountingData.payment_method}</p>
          <p><strong>Banka:</strong> ${accountingData.bank_name || 'N/A'}</p>
          <p><strong>Sonuç:</strong> ${accountingData.payment_status}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
          <h3 style="color: #495057; margin-top: 0;">👨‍💼 SATICI BİLGİLERİ</h3>
          <p><strong>Satıcının Adı Soyadı:</strong> ${accountingData.seller_name}</p>
          <p><strong>Satıcının ID Numarası:</strong> ${accountingData.seller_id}</p>
          <p><strong>Satıcının Sponsoru:</strong> ${accountingData.seller_sponsor}</p>
          <p><strong>Sponsorunun ID Numarası:</strong> ${accountingData.sponsor_id}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Bu rapor otomatik olarak oluşturulmuştur.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Accounting report email sent to muhasebe@hoowell.net');
    return { success: true };
  } catch (error) {
    console.error('❌ Accounting report email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendCustomerWelcomeEmail,
  sendSellerNotificationEmail,
  sendPartnerWelcomeEmail,
  sendSponsorNotificationEmail,
  sendAccountingReportEmail
};
