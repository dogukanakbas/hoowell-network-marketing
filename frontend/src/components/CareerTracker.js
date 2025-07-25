import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CareerTracker = () => {
  const { user } = useAuth();
  const [careerData, setCareerData] = useState({
    current_level: 'bronze',
    total_kkp: 0,
    active_partners: 0,
    target_kkp: 20000,
    target_partners: 1
  });
  const [careerBonuses, setCareerBonuses] = useState([]);
  const [showBonusModal, setShowBonusModal] = useState(false);

  useEffect(() => {
    fetchCareerData();
    fetchCareerBonuses();
  }, []);

  const fetchCareerData = async () => {
    try {
      const response = await axios.get('/api/career/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCareerData(response.data);

      // Check if level was upgraded
      if (response.data.level_upgraded) {
        setShowBonusModal(true);
        // Refresh bonuses after level upgrade
        setTimeout(() => {
          fetchCareerBonuses();
        }, 1000);
      }
    } catch (error) {
      console.error('Career data fetch error:', error);
    }
  };

  const fetchCareerBonuses = async () => {
    try {
      const response = await axios.get('/api/career/bonuses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCareerBonuses(response.data);
    } catch (error) {
      console.error('Career bonuses fetch error:', error);
    }
  };

  // Kariyer seviyesi bilgileri
  const careerLevels = {
    bronze: {
      name: 'BRONZE İŞ ORTAĞI',
      kkp_required: 0,
      partners_required: 0,
      color: '#CD7F32',
      progressColor: '#808080',
      remainingColor: '#DC143C',
      headerColor: '#DC143C',
      next_level: 'silver'
    },
    silver: {
      name: 'SILVER İŞ ORTAĞI',
      kkp_required: 20000,
      partners_required: 1,
      color: '#C0C0C0',
      progressColor: '#FFD700', // Altın renk
      remainingColor: '#808080', // Gri kalan
      headerColor: '#808080', // Gri header
      next_level: 'gold'
    },
    gold: {
      name: 'GOLD İŞ ORTAĞI',
      kkp_required: 50000,
      partners_required: 3,
      color: '#FFD700',
      progressColor: '#4A90E2', // Mavi renk (yapılan kısım)
      remainingColor: '#FFD700', // Altın renk (kalan kısım)
      headerColor: '#FFD700',
      next_level: 'star_leader'
    },
    star_leader: {
      name: 'STAR LEADER',
      kkp_required: 100000,
      partners_required: 7,
      color: '#FF6B35',
      progressColor: '#FF6B35',
      remainingColor: '#808080',
      headerColor: '#FF6B35',
      next_level: 'super_star_leader'
    },
    super_star_leader: {
      name: 'SUPER STAR LEADER',
      kkp_required: 175000,
      partners_required: 15,
      color: '#8A2BE2',
      progressColor: '#8A2BE2',
      remainingColor: '#808080',
      headerColor: '#8A2BE2',
      next_level: 'presidents_team'
    },
    presidents_team: {
      name: 'PRESIDENTS TEAM',
      kkp_required: 300000,
      partners_required: 25,
      color: '#DC143C',
      progressColor: '#DC143C',
      remainingColor: '#808080',
      headerColor: '#DC143C',
      next_level: 'country_distributor'
    },
    country_distributor: {
      name: 'ÜLKE DISTRIBÜTÖRÜ',
      kkp_required: 400000,
      partners_required: 30,
      color: '#4B0082',
      progressColor: '#4B0082',
      remainingColor: '#808080',
      headerColor: '#4B0082',
      next_level: null
    }
  };

  const currentLevel = careerLevels[careerData.current_level] || careerLevels.bronze;
  const nextLevel = currentLevel.next_level ? careerLevels[currentLevel.next_level] : null;

  // Hedef değerler (bir sonraki seviye için)
  const targetKKP = nextLevel ? nextLevel.kkp_required : currentLevel.kkp_required;
  const targetPartners = nextLevel ? nextLevel.partners_required : currentLevel.partners_required;

  // İlerleme hesaplamaları
  const kkpProgress = targetKKP > 0 ? Math.min((careerData.total_kkp / targetKKP) * 100, 100) : 100;
  const remainingKKP = Math.max(targetKKP - careerData.total_kkp, 0);

  // Partner durumu
  const hasRequiredPartners = careerData.active_partners >= targetPartners;

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: 'var(--background-light)'
    }}>
      {/* Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          color: 'var(--accent-gold)',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          KARİYER TAKİP PANELİ
        </h1>

        {/* Hoowell Logo */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--accent-gold)',
          color: 'var(--white)',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          HooWell
        </div>
      </div>

      {/* Ana Kart */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'var(--white)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Kariyer Seviyesi */}
        <div style={{
          backgroundColor: currentLevel.headerColor,
          color: 'var(--white)',
          padding: '15px 30px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <div>KARİYER SEVİYESİ</div>
          <div style={{ fontSize: '20px', marginTop: '5px' }}>
            {currentLevel.name}
          </div>
        </div>

        {/* Ciro Hedefi Bölümü */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            color: 'var(--accent-gold)',
            fontSize: '24px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            CİRO HEDEFİ
          </h2>

          {/* Progress Bar Container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Yapılan Kısım */}
            <div style={{
              backgroundColor: '#808080',
              color: 'var(--white)',
              padding: '15px 20px',
              borderRadius: '10px',
              minWidth: '120px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              <div>YAPILAN</div>
              <div style={{ fontSize: '16px', marginTop: '5px' }}>
                {careerData.total_kkp.toLocaleString()} Puan
              </div>
            </div>

            {/* Progress Bar - Görseldeki gibi */}
            <div style={{
              flex: 1,
              height: '60px',
              position: 'relative',
              display: 'flex'
            }}>
              {/* Yapılan kısım (sol) - Seviye rengine göre */}
              <div style={{
                width: `${kkpProgress}%`,
                height: '100%',
                backgroundColor: currentLevel.progressColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontWeight: 'bold',
                fontSize: '14px',
                borderRadius: kkpProgress > 0 ? '10px 0 0 10px' : '0',
                minWidth: kkpProgress > 0 ? '80px' : '0',
                transition: 'all 0.5s ease'
              }}>
                {kkpProgress > 15 && `${careerData.total_kkp.toLocaleString()} Puan`}
              </div>

              {/* Kalan kısım (sağ) - Seviye rengine göre */}
              <div style={{
                width: `${100 - kkpProgress}%`,
                height: '100%',
                backgroundColor: currentLevel.remainingColor || '#808080',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: kkpProgress < 100 ? '0 10px 10px 0' : '0',
                transition: 'all 0.5s ease'
              }}>
                {kkpProgress < 85 && `KALAN: ${remainingKKP.toLocaleString()} Puan`}
              </div>

              {/* KALAN yazısı üstte */}
              {kkpProgress >= 85 && kkpProgress < 100 && (
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  right: '10px',
                  color: '#808080',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  KALAN: {remainingKKP.toLocaleString()} Puan
                </div>
              )}
            </div>

            {/* Circular Progress - Görseldeki gibi */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Arka plan daire - Kırmızı */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#DC143C'
              }} />

              {/* İlerleme dairesi - Seviye rengine göre */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `conic-gradient(${currentLevel.progressColor} 0deg ${(kkpProgress / 100) * 360}deg, transparent ${(kkpProgress / 100) * 360}deg 360deg)`,
                transition: 'background 0.5s ease'
              }} />

              {/* İç daire - Seviye rengine göre */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: kkpProgress >= 100 ? currentLevel.progressColor : '#DC143C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontWeight: 'bold',
                fontSize: '12px',
                textAlign: 'center',
                zIndex: 2,
                transition: 'background-color 0.5s ease'
              }}>
                <div>
                  <div>{targetKKP.toLocaleString()}</div>
                  <div>PUAN</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İş Ortağı Hedefi */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            color: 'var(--accent-gold)',
            fontSize: '24px',
            marginBottom: '20px'
          }}>
            İŞ ORTAĞI HEDEFİ
          </h2>

          {/* Partner Icons - Seviyeye göre */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {Array.from({ length: targetPartners }, (_, index) => (
              <div
                key={index}
                style={{
                  fontSize: '80px',
                  color: index < careerData.active_partners ? '#28a745' : '#808080',
                  transition: 'color 0.3s ease'
                }}
              >
                👤
              </div>
            ))}
          </div>

          <div style={{
            fontSize: '18px',
            color: 'var(--text-dark)',
            marginBottom: '10px'
          }}>
            <strong>{careerData.active_partners}</strong> / <strong>{targetPartners}</strong> İş Ortağı
          </div>

          {hasRequiredPartners && (
            <div style={{
              color: '#28a745',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ✓ Hedef Tamamlandı!
            </div>
          )}
        </div>

        {/* Kariyer Atlama Bonusları */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px'
        }}>
          <h3 style={{
            color: 'var(--primary-dark)',
            fontSize: '20px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            KARİYER ATLAMA BONUSLARI
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {[
              { level: 'silver', kkp: 20000, bonus: 400, name: 'Silver' },
              { level: 'gold', kkp: 50000, bonus: 800, name: 'Gold' },
              { level: 'star_leader', kkp: 100000, bonus: 1200, name: 'Star Leader' },
              { level: 'super_star_leader', kkp: 175000, bonus: 1600, name: 'Super Star Leader' }
            ].map((item) => {
              const isEarned = careerBonuses.some(b => b.career_level === item.level);
              const isCurrentTarget = nextLevel && nextLevel.name.toLowerCase().includes(item.name.toLowerCase());

              return (
                <div
                  key={item.level}
                  style={{
                    backgroundColor: isEarned ? '#28a745' : isCurrentTarget ? '#FFD700' : 'var(--white)',
                    color: isEarned || isCurrentTarget ? 'var(--white)' : 'var(--text-dark)',
                    padding: '15px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: isCurrentTarget ? '2px solid #FFD700' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                    {item.kkp.toLocaleString()} KKP
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    ${item.bonus}
                    {isEarned && ' ✓'}
                  </div>
                </div>
              );
            })}
          </div>

          {careerBonuses.length > 0 && (
            <div style={{
              backgroundColor: 'var(--white)',
              padding: '15px',
              borderRadius: '10px',
              marginTop: '15px'
            }}>
              <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px' }}>
                Kazanılan Bonuslar:
              </h4>
              {careerBonuses.map((bonus, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < careerBonuses.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {bonus.career_level.toUpperCase()} Bonus
                  </span>
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                    ${bonus.bonus_amount_usd} ({bonus.bonus_amount_try.toLocaleString()} TL)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alt Bilgi */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: 'var(--card-gray)',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            color: 'var(--text-dark)',
            fontSize: '16px',
            marginBottom: '10px'
          }}>
            {nextLevel ? (
              <>
                <strong>{nextLevel.name}</strong> seviyesine ulaşmak için:
                <br />
                <span style={{ color: '#DC143C', fontWeight: 'bold' }}>
                  {remainingKKP.toLocaleString()} KKP puan
                </span>
                {!hasRequiredPartners && (
                  <>
                    {' ve '}
                    <span style={{ color: '#DC143C', fontWeight: 'bold' }}>
                      {targetPartners - careerData.active_partners} iş ortağı
                    </span>
                  </>
                )}
                {' daha gerekli.'}
              </>
            ) : (
              <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                En yüksek kariyer seviyesindesiniz! 🎉
              </span>
            )}
          </div>
        </div>

        {/* Hoowell Bilgi Bankası Logo */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'var(--accent-gold)',
          color: 'var(--white)',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <div>Hoowell</div>
          <div>BİLGİ</div>
          <div>BANKASI</div>
        </div>
      </div>
    </div>
  );
};

export default CareerTracker;