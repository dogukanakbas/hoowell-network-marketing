import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Certificate from './Certificate';

const Education = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showExam, setShowExam] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    fetchVideos();
    fetchUserProgress();
  }, [user]);

  // Geri sayım hesaplama
  useEffect(() => {
    if (!user?.education_deadline) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(user.education_deadline);
      const now = new Date();
      const difference = deadline - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [user?.education_deadline]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/education/progress');
      
      // Progress array'i al
      const progressData = response.data.progress || response.data;
      setUserProgress(Array.isArray(progressData) ? progressData : []);
      
      // Eğitim tamamlandıysa otomatik yönlendir
      if (response.data.education_completed && response.data.backoffice_access) {
        await refreshUser();
        setCompletionMessage('🎉 Eğitimleriniz tamamlanmış! Backoffice sistemine yönlendiriliyorsunuz.');
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchQuestions = async (videoId) => {
    try {
      const response = await axios.get(`/api/videos/${videoId}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleVideoComplete = async (videoId) => {
    try {
      await axios.post(`/api/education/video-complete`, { video_id: videoId });
      fetchQuestions(videoId);
      setShowExam(true);
      setCurrentVideo(videoId);
    } catch (error) {
      console.error('Error marking video complete:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitExam = async () => {
    try {
      const response = await axios.post('/api/education/submit-exam', {
        video_id: currentVideo,
        answers: answers
      });

      setExamResult(response.data);
      
      if (response.data.passed) {
        await fetchUserProgress();
        
        // Eğitim tamamlandı mı kontrol et
        if (response.data.education_completed) {
          // User bilgilerini yenile
          await refreshUser();
          
          // Tebrikler mesajı göster
          setCompletionMessage('🎉 ' + (response.data.message || 'Tebrikler! Eğitimlerinizi başarıyla tamamladınız. Artık backoffice sistemine erişebilirsiniz.'));
          setShowCompletionModal(true);
        } else {
          // User bilgilerini yenile (eğitim devam ediyor)
          await refreshUser();
        }
      }
      
      setAnswers({});
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Sınav gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const getVideoProgress = (videoId) => {
    return userProgress.find(p => p.video_id === videoId) || {};
  };

  const canWatchVideo = (videoIndex) => {
    // Eğitim tamamlanan kullanıcılar tüm videoları izleyebilir
    if (user?.education_completed) return true;
    
    // İlk video her zaman izlenebilir
    if (videoIndex === 0) return true;
    
    // Diğer videolar için önceki videonun sınavının geçilmiş olması gerekir
    const previousVideo = videos[videoIndex - 1];
    const previousProgress = getVideoProgress(previousVideo?.id);
    
    return previousProgress.exam_passed;
  };

  const getEmbedUrl = (driveUrl) => {
    // Convert Google Drive share URL to embed URL
    const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : driveUrl;
  };

  // Ödeme bloklu kullanıcılar için uyarı
  if (user.payment_blocked) {
    return (
      <div className="dashboard-card">
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>⚠️ Erişim Engellendi</h3>
          <p>Ödemeniz reddedilmiştir. Eğitimlere devam edebilmek için lütfen geçerli bir ödeme makbuzu yükleyiniz.</p>
          <a href="/payment" className="btn btn-primary" style={{ marginTop: '15px' }}>
            Ödeme Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e2323 0%, #1a4a3a 50%, #0e2323 100%)',
      padding: '0',
      margin: '0 -20px'
    }}>
      {/* Üst Başlık ve Logo Alanı */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 40px',
        borderBottom: '2px solid rgba(255, 215, 0, 0.2)'
      }}>
        {/* Sol Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{
            color: '#FFD700',
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            HOOWELL TEMEL EĞİTİM PANELİ
          </h1>

          {/* Sertifika Butonu - Sadece eğitim tamamlanan kullanıcılar için */}
          {user?.education_completed && (
            <button
              onClick={() => setShowCertificate(true)}
              style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '12px 25px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(40, 167, 69, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.4)';
              }}
            >
              🎓 SERTİFİKAMI GÖSTER
            </button>
          )}
        </div>

        {/* Sağ Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '80px',
            margin: '0 auto 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/hoowell-logo.png" 
              alt="HOOWELL Logo" 
              style={{
                width: '80px',
                height: '60px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback logo eğer resim yüklenemezse
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              width: '80px',
              height: '60px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#0e2323'
            }}>
              H
            </div>
          </div>

        </div>
      </div>

      {/* Geri Sayım Alanı - Sadece eğitim tamamlanmamış kullanıcılar için */}
      {user?.education_deadline && !user?.education_completed && (
        <div style={{
          padding: '20px 40px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '20px',
            padding: '20px',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: '#FFD700',
              fontSize: '20px',
              marginBottom: '15px',
              fontWeight: 'bold'
            }}>
              VİDEOLARDAN SONRA TESTLERİ GEÇİN
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '10px',
                padding: '10px 15px',
                minWidth: '70px',
                border: '1px solid rgba(255, 215, 0, 0.4)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
                  {timeLeft.days}
                </div>
                <div style={{ fontSize: '10px', color: '#fff' }}>GÜN</div>
              </div>
              <div style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '10px',
                padding: '10px 15px',
                minWidth: '70px',
                border: '1px solid rgba(255, 215, 0, 0.4)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
                  {timeLeft.hours}
                </div>
                <div style={{ fontSize: '10px', color: '#fff' }}>SAAT</div>
              </div>
              <div style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '10px',
                padding: '10px 15px',
                minWidth: '70px',
                border: '1px solid rgba(255, 215, 0, 0.4)'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
                  {timeLeft.minutes}
                </div>
                <div style={{ fontSize: '10px', color: '#fff' }}>DAKİKA</div>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '15px',
              padding: '10px',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <div style={{ color: '#FFD700', fontSize: '14px', fontWeight: 'bold' }}>
                HEDEF %70 BAŞARI
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div style={{
        padding: '30px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {videos.map((video, index) => {
          const progress = getVideoProgress(video.id);
          const canWatch = canWatchVideo(index);
          
          return (
            <div
              key={video.id}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '15px',
                padding: '20px',
                border: progress.exam_passed ? '2px solid #28a745' : 
                       progress.watched ? '2px solid #ffc107' : 
                       canWatch ? '2px solid #FFD700' : '2px solid #666',
                backdropFilter: 'blur(10px)',
                opacity: canWatch ? 1 : 0.6,
                transition: 'all 0.3s ease',
                cursor: canWatch ? 'pointer' : 'not-allowed',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (canWatch) {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (canWatch) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {/* Video Numarası */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: progress.exam_passed ? '#28a745' : 
                           progress.watched ? '#ffc107' : 
                           canWatch ? '#FFD700' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: progress.exam_passed || progress.watched || canWatch ? '#000' : '#fff'
              }}>
                {index + 1}
              </div>

              {/* Video Başlığı */}
              <h3 style={{
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '10px',
                marginRight: '50px',
                lineHeight: '1.3'
              }}>
                {video.title.toUpperCase()}
              </h3>

              {/* Video Açıklaması */}
              <p style={{
                color: '#ccc',
                fontSize: '12px',
                marginBottom: '15px',
                lineHeight: '1.4'
              }}>
                {video.description}
              </p>

              {/* Video Kapak Görseli */}
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '10px',
                marginBottom: '15px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                background: '#000'
              }}>
                {video.cover_image ? (
                  <img 
                    src={video.cover_image} 
                    alt={video.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: canWatch ? 1 : 0.4,
                      transition: 'opacity 0.3s ease'
                    }}
                    onError={(e) => {
                      // Fallback kapak görseli
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback veya kapak yoksa */}
                <div style={{
                  display: video.cover_image ? 'none' : 'flex',
                  width: '100%',
                  height: '100%',
                  background: canWatch ? 
                    'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2))' : 
                    'rgba(102, 102, 102, 0.3)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}>
                  {canWatch ? (
                    <div style={{
                      fontSize: '40px',
                      color: '#FFD700'
                    }}>
                      ▶️
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '40px',
                      color: '#666'
                    }}>
                      🔒
                    </div>
                  )}
                </div>

                {/* Play Button Overlay */}
                {canWatch && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#FFD700',
                    backdropFilter: 'blur(5px)',
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 215, 0, 0.9)';
                    e.target.style.color = '#000';
                    e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                    e.target.style.color = '#FFD700';
                    e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                  }}
                  >
                    ▶
                  </div>
                )}

                {/* Kilit İkonu */}
                {!canWatch && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(102, 102, 102, 0.8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#fff',
                    backdropFilter: 'blur(5px)'
                  }}>
                    🔒
                  </div>
                )}

                {/* Video Durumu Badge */}
                {progress.exam_passed && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    ✅ TAMAMLANDI
                  </div>
                )}
                
                {progress.watched && !progress.exam_passed && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#ffc107',
                    color: '#000',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    📝 SINAV BEKLİYOR
                  </div>
                )}
              </div>

              {/* Durum ve Butonlar */}
              <div style={{ textAlign: 'center' }}>
                {progress.exam_passed && (
                  <div>
                    <div style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}>
                      ✅ TAMAMLANDI
                    </div>
                    {/* Eğitim tamamlanan kullanıcılar için tekrar izleme butonu */}
                    {user?.education_completed && (
                      <button
                        onClick={() => {
                          setCurrentVideo(video.id);
                          setShowVideoModal(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #28a745, #20c997)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '8px 20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        TEKRAR İZLE
                      </button>
                    )}
                  </div>
                )}
                
                {progress.watched && !progress.exam_passed && (
                  <div>
                    <div style={{
                      background: '#ffc107',
                      color: '#000',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}>
                      📝 SINAV BEKLİYOR
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          setCurrentVideo(video.id);
                          setShowVideoModal(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #17a2b8, #138496)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '8px 15px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        TEKRAR İZLE
                      </button>
                      <button
                        onClick={() => {
                          fetchQuestions(video.id);
                          setCurrentVideo(video.id);
                          setShowExam(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '8px 15px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        SINAVA GİR
                      </button>
                    </div>
                  </div>
                )}
                
                {canWatch && !progress.watched && (
                  <button
                    onClick={() => {
                      setCurrentVideo(video.id);
                      setShowVideoModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 25px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    VİDEOYU İZLE
                  </button>
                )}
                
                {!canWatch && (
                  <div style={{
                    background: '#666',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🔒 KİTLİ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Modal */}
      {showExam && (
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
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0e2323, #1a4a3a)',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '2px solid #FFD700',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            {examResult ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '60px',
                  marginBottom: '20px'
                }}>
                  {examResult.passed ? '🎉' : '😞'}
                </div>
                
                <h3 style={{
                  color: '#FFD700',
                  fontSize: '28px',
                  marginBottom: '20px',
                  fontWeight: 'bold'
                }}>
                  {examResult.passed ? 'TEBRİKLER!' : 'BAŞARISIZ'}
                </h3>
                
                <div style={{
                  background: examResult.passed ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                  border: examResult.passed ? '2px solid #28a745' : '2px solid #dc3545',
                  borderRadius: '15px',
                  padding: '25px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: examResult.passed ? '#28a745' : '#dc3545',
                    marginBottom: '10px'
                  }}>
                    {examResult.score}/10
                  </div>
                  <p style={{
                    color: '#fff',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {examResult.passed ? (
                      'Sınavı başarıyla geçtiniz! Bir sonraki videoya geçebilirsiniz.'
                    ) : (
                      'Sınavı geçmek için en az 7 doğru cevap vermelisiniz. Tekrar deneyebilirsiniz.'
                    )}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowExam(false);
                    setExamResult(null);
                    setCurrentVideo(null);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '15px 40px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)'
                  }}
                >
                  KAPAT
                </button>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h3 style={{
                    color: '#FFD700',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    📝 VİDEO SINAVI
                  </h3>
                  <p style={{
                    color: '#ccc',
                    fontSize: '16px',
                    margin: 0
                  }}>
                    10 sorudan en az 7'sini doğru cevaplamanız gerekmektedir.
                  </p>
                </div>

                <div style={{
                  maxHeight: '500px',
                  overflowY: 'auto',
                  paddingRight: '15px',
                  marginBottom: '20px'
                }}>
                  {questions.map((question, index) => (
                    <div key={question.id} style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '15px',
                      padding: '25px',
                      marginBottom: '25px',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h5 style={{
                        color: '#FFD700',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          background: '#FFD700',
                          color: '#000',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </span>
                        Soru {index + 1}
                      </h5>
                      <div style={{
                        color: '#fff',
                        fontSize: '15px',
                        marginBottom: '20px',
                        lineHeight: '1.7',
                        padding: '18px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        minHeight: 'auto',
                        display: 'block',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}>
                        {question.question_text}
                      </div>
                      
                      {['a', 'b', 'c', 'd'].map(option => (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '15px',
                          cursor: 'pointer',
                          padding: '15px',
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          backgroundColor: answers[question.id] === option ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          border: answers[question.id] === option ? '2px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                          minHeight: 'auto',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                        onMouseEnter={(e) => {
                          if (answers[question.id] !== option) {
                            e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (answers[question.id] !== option) {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                          }
                        }}
                        >
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value={option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            style={{
                              marginRight: '15px',
                              marginTop: '3px',
                              transform: 'scale(1.3)',
                              accentColor: '#FFD700',
                              flexShrink: 0
                            }}
                          />
                          <div style={{
                            color: answers[question.id] === option ? '#FFD700' : '#ccc',
                            fontSize: '14px',
                            fontWeight: answers[question.id] === option ? 'bold' : 'normal',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            flex: 1,
                            display: 'block',
                            width: '100%'
                          }}>
                            <strong style={{ 
                              color: answers[question.id] === option ? '#FFD700' : '#fff',
                              marginRight: '8px'
                            }}>
                              {option.toUpperCase()})
                            </strong>
                            <span style={{
                              display: 'inline',
                              lineHeight: '1.6',
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {question[`option_${option}`]}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center',
                  marginTop: '30px'
                }}>
                  <button
                    onClick={() => {
                      setShowExam(false);
                      setAnswers({});
                    }}
                    style={{
                      background: 'rgba(108, 117, 125, 0.8)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '12px 30px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    İPTAL
                  </button>
                  <button
                    onClick={submitExam}
                    disabled={Object.keys(answers).length !== questions.length}
                    style={{
                      background: Object.keys(answers).length === questions.length ? 
                        'linear-gradient(135deg, #FFD700, #FFA500)' : 
                        'rgba(108, 117, 125, 0.5)',
                      color: Object.keys(answers).length === questions.length ? '#000' : '#666',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '12px 30px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: Object.keys(answers).length === questions.length ? 'pointer' : 'not-allowed',
                      boxShadow: Object.keys(answers).length === questions.length ? 
                        '0 5px 15px rgba(255, 215, 0, 0.4)' : 'none'
                    }}
                  >
                    SINAVI BİTİR ({Object.keys(answers).length}/{questions.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && currentVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0e2323, #1a4a3a)',
            padding: '30px',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '2px solid #FFD700',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Kapat Butonu */}
            <button
              onClick={() => {
                setShowVideoModal(false);
                setCurrentVideo(null);
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Video Başlığı */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{
                color: '#FFD700',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {videos.find(v => v.id === currentVideo)?.title}
              </h3>
              <p style={{
                color: '#ccc',
                fontSize: '14px',
                margin: 0
              }}>
                {videos.find(v => v.id === currentVideo)?.description}
              </p>
            </div>

            {/* Video Player */}
            <div style={{
              width: '100%',
              height: '500px',
              marginBottom: '20px',
              borderRadius: '15px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 215, 0, 0.3)'
            }}>
              <iframe
                src={getEmbedUrl(videos.find(v => v.id === currentVideo)?.google_drive_url || '')}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title={videos.find(v => v.id === currentVideo)?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Tamamlama Butonu */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  handleVideoComplete(currentVideo);
                  setShowVideoModal(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '15px 40px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
                  marginRight: '15px'
                }}
              >
                📝 VİDEOYU TAMAMLADIM - SINAVA GEÇ
              </button>
              
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setCurrentVideo(null);
                }}
                style={{
                  background: 'rgba(108, 117, 125, 0.8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '15px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                KAPAT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sertifika Modal */}
      {showCertificate && (
        <Certificate onClose={() => setShowCertificate(false)} />
      )}

      {/* Eğitim Tamamlama Modal */}
      {showCompletionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '3px solid #FFD700'
          }}>
            <div style={{
              fontSize: '60px',
              marginBottom: '20px'
            }}>
              🎉
            </div>
            
            <h2 style={{
              color: '#0e2323',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              TEBRİKLER!
            </h2>
            
            <p style={{
              color: '#333',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              {completionMessage.replace('🎉 ', '')}
            </p>
            
            <button
              onClick={() => {
                setShowCompletionModal(false);
                navigate('/');
              }}
              style={{
                backgroundColor: '#FFD700',
                color: '#0e2323',
                border: 'none',
                borderRadius: '25px',
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.3)';
              }}
            >
              🏠 Ana Sayfaya Git
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;