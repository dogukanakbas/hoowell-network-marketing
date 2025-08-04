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
            background: 'linear-gradient(135deg, #0e2323 0%, #1a4a3a 50%, #0e2323 100%)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            border: '10px solid #FFD700',
            borderRadius: '20px',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
          }}
        >
          {/* Üst Logo ve Başlık */}
          <div style={{
            position: 'absolute',
            top: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              marginBottom: '10px'
            }}>
              HOOWELL
            </div>
            <div style={{
              fontSize: '16px',
              color: '#FFD700',
              letterSpacing: '2px'
            }}>
              SU ARITMA SİSTEMLERİ
            </div>
          </div>

          {/* Sertifika Başlığı */}
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: '30px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            EĞİTİM TAMAMLAMA SERTİFİKASI
          </div>

          {/* Ana İçerik */}
          <div style={{
            textAlign: 'center',
            fontSize: '18px',
            lineHeight: '1.8',
            maxWidth: '600px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              Bu sertifika ile
            </div>
            
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#FFD700',
              margin: '20px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              borderBottom: '2px solid #FFD700',
              paddingBottom: '10px'
            }}>
              {user.first_name} {user.last_name}
            </div>

            <div style={{ marginBottom: '20px' }}>
              HOOWELL Su Arıtma Sistemleri Eğitim Programını başarıyla tamamladığını
              ve iş ortaklığı yapmaya hak kazandığını beyan ederiz.
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '40px',
              fontSize: '14px'
            }}>
              <div>
                <div style={{ marginBottom: '5px' }}>Partner ID:</div>
                <div style={{ 
                  color: '#FFD700', 
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {user.sponsor_id}
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '5px' }}>Tarih:</div>
                <div style={{ 
                  color: '#FFD700', 
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {getCurrentDate()}
                </div>
              </div>
            </div>
          </div>

          {/* Alt Logo */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '12px',
            color: '#FFD700',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold' }}>HOOWELL TEKNOLOJİ A.Ş.</div>
            <div>www.hoowell.com</div>
          </div>

          {/* Dekoratif Elementler */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '60px',
            height: '60px',
            border: '3px solid #FFD700',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🏆
          </div>

          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            border: '3px solid #FFD700',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ⭐
          </div>
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