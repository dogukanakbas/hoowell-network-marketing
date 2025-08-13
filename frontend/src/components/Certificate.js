import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Certificate = ({ onClose }) => {
  const { user } = useAuth();
  const certificateRef = useRef();

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    const imgWidth = 297; // A4 landscape width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${user.first_name}_${user.last_name}_Sertifika.pdf`);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Sertifika Tasarımı */}
        <div
          ref={certificateRef}
          style={{
            width: '800px',
            height: '600px',
            background: '#0f2324',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden'
          }}
        >
          {/* Üst Sol Logo */}
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '40px',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#0e2323',
            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)'
          }}>
            H
          </div>

          {/* Altın Çizgiler - Üst */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '120px',
            background: 'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.3) 30%, rgba(255, 215, 0, 0.1) 70%, transparent 100%)',
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)'
          }} />

          {/* Altın Çizgiler - Alt */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '120px',
            background: 'linear-gradient(135deg, transparent 0%, rgba(255, 215, 0, 0.3) 30%, rgba(255, 215, 0, 0.1) 70%, transparent 100%)',
            clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)'
          }} />

          {/* Merkez Logo ve Kep */}
          <div style={{
            position: 'absolute',
            top: '80px',
            textAlign: 'center',
            zIndex: 2
          }}>
            {/* Mezuniyet Kepçesi */}
            <div style={{
              fontSize: '60px',
              marginBottom: '10px',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}>
              🎓
            </div>

            {/* HOOWELL Logo Çemberi */}
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #000, #333)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '4px solid #FFD700',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}>
              {/* İç Logo */}
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000'
              }}>
                H
              </div>

              {/* HOOWELL Yazısı - Çember Etrafında */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#FFD700',
                letterSpacing: '2px'
              }}>
                HOOWELL
              </div>

              <div style={{
                position: 'absolute',
                bottom: '-15px',
                fontSize: '10px',
                color: '#FFD700',
                letterSpacing: '1px'
              }}>
                FRANCHISE SERTİFİKASI
              </div>
            </div>
          </div>

          {/* Kişi Adı - Büyük ve Belirgin */}
          <div style={{
            position: 'absolute',
            top: '280px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
            textAlign: 'center',
            letterSpacing: '2px',
            zIndex: 2
          }}>
            {user.first_name} {user.last_name}
          </div>

          {/* Ana Metin */}
          <div style={{
            position: 'absolute',
            top: '340px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '18px',
            lineHeight: '1.6',
            maxWidth: '600px',
            color: '#fff',
            zIndex: 2
          }}>
            <div style={{ marginBottom: '15px' }}>
              Hoowell Franchise Eğitim Programını başarı ile bitirdiniz.
            </div>
            <div>
              Hoowell Ticaretinizde başarılar dileriz.
            </div>
          </div>

          {/* Alt Sağ Logo ve Slogan */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            textAlign: 'right',
            zIndex: 2
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginBottom: '5px',
              letterSpacing: '1px'
            }}>
              HOOWELL
            </div>
            <div style={{
              fontSize: '12px',
              color: '#FFD700',
              letterSpacing: '1px'
            }}>
              INNOVATE YOUR LIFE
            </div>
          </div>

          {/* Tarih ve Partner ID - Alt Sol */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '40px',
            fontSize: '12px',
            color: '#ccc',
            zIndex: 2
          }}>
            <div style={{ marginBottom: '5px' }}>
              Partner ID: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{user.sponsor_id}</span>
            </div>
            <div>
              Tarih: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{getCurrentDate()}</span>
            </div>
          </div>

          {/* Arka Plan Deseni */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
            `,
            zIndex: 1
          }} />
        </div>

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px'
        }}>
          <button
            onClick={downloadCertificate}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📥 Sertifikayı İndir
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 30px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;