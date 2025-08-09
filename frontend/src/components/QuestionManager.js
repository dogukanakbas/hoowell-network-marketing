import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionManager = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [questions, setQuestions] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVideo || !questions.trim()) {
      setMessage('Video seçin ve soruları girin');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Gelişmiş soru parsing - uzun sorular ve çok satırlı metinler için
      const questionLines = questions.trim().split('\n').map(line => line.trim()).filter(line => line);
      const parsedQuestions = [];

      let currentQuestion = null;
      let currentField = null;

      for (let i = 0; i < questionLines.length; i++) {
        const line = questionLines[i];

        // Soru tespiti - soru işareti ile biten satırlar
        if (line.includes('?')) {
          // Önceki soruyu kaydet
          if (currentQuestion && currentQuestion.text && currentQuestion.a && currentQuestion.b && currentQuestion.c && currentQuestion.d && currentQuestion.correct) {
            parsedQuestions.push(currentQuestion);
          }

          // Yeni soru başlat
          currentQuestion = {
            text: line,
            a: '',
            b: '',
            c: '',
            d: '',
            correct: ''
          };
          currentField = 'text';
        }
        // Seçenek tespiti
        else if (line.match(/^[a-dA-D][\-\)\.]?\s*/)) {
          if (!currentQuestion) continue;

          const optionMatch = line.match(/^([a-dA-D])[\-\)\.]?\s*(.+)$/);
          if (optionMatch) {
            const option = optionMatch[1].toLowerCase();
            const text = optionMatch[2].trim();
            currentQuestion[option] = text;
            currentField = option;
          }
        }
        // Cevap tespiti
        else if (line.match(/^(cevap|Cevap|CEVAP|doğru|Doğru|DOĞRU|answer)[\s\:]+([a-dA-D])/i)) {
          if (!currentQuestion) continue;

          const answerMatch = line.match(/^(?:cevap|Cevap|CEVAP|doğru|Doğru|DOĞRU|answer)[\s\:]+([a-dA-D])/i);
          if (answerMatch) {
            currentQuestion.correct = answerMatch[1].toLowerCase();
            currentField = null;
          }
        }
        // Devam eden metin (uzun sorular veya seçenekler için)
        else if (currentField && currentQuestion) {
          // Mevcut alana devam eden metni ekle
          if (currentField === 'text') {
            currentQuestion.text += ' ' + line;
          } else if (['a', 'b', 'c', 'd'].includes(currentField)) {
            currentQuestion[currentField] += ' ' + line;
          }
        }
      }

      // Son soruyu da ekle
      if (currentQuestion && currentQuestion.text && currentQuestion.a && currentQuestion.b && currentQuestion.c && currentQuestion.d && currentQuestion.correct) {
        parsedQuestions.push(currentQuestion);
      }

      // Validation - eksik alanları kontrol et
      const validQuestions = parsedQuestions.filter(q => {
        const isValid = q.text && q.a && q.b && q.c && q.d && q.correct && ['a', 'b', 'c', 'd'].includes(q.correct);
        if (!isValid) {
          console.warn('Geçersiz soru:', q);
        }
        return isValid;
      });

      if (validQuestions.length === 0) {
        setMessage('❌ Hiçbir geçerli soru bulunamadı. Lütfen format kontrolü yapın.');
        return;
      }

      if (validQuestions.length !== parsedQuestions.length) {
        setMessage(`⚠️ ${parsedQuestions.length - validQuestions.length} soru geçersiz format nedeniyle atlandı.`);
      }

      const response = await axios.post('/api/admin/questions/bulk', {
        video_id: selectedVideo,
        questions: validQuestions
      });

      setMessage(`✅ ${validQuestions.length} soru başarıyla eklendi! ${response.data.message || ''}`);
      setQuestions('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Sorular eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Soru Yönetimi</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Video Seçin</label>
          <select
            className="form-control"
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            required
          >
            <option value="">Video seçin...</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                Video {video.order_number}: {video.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sorular (Metin formatında)</label>
          <textarea
            className="form-control"
            rows="20"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Soruları şu formatta girin (uzun sorular desteklenir):

Su arıtma cihazlarında hangi teknoloji kullanılır ve bu teknolojinin 
avantajları nelerdir?
a) Reverse osmosis teknolojisi, tüm mineralleri filtreler
b) UV sterilizasyon, bakterileri öldürür
c) Karbon filtrasyon, klorun tadını giderir  
d) İyon değişimi, suyun pH değerini ayarlar
cevap: a

Alkali su neden önemlidir?
a) Vücudu asitleştirir
b) Antioksidan özelliği vardır
c) Mineralleri azaltır
d) Sadece temizlik yapar
cevap: b

NOTLAR:
• Uzun sorular birden fazla satıra yazılabilir
• Seçenekler a), a-, a. formatlarında olabilir
• Cevap: a, Cevap: b, CEVAP: c formatları desteklenir"
            required
          />
        </div>

        {message && (
          <div style={{
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            backgroundColor: message.includes('başarıyla') ? '#d4edda' : '#f8d7da',
            color: message.includes('başarıyla') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Ekleniyor...' : 'Soruları Ekle'}
        </button>
      </form>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '2px solid #e9ecef' }}>
        <h4 style={{ color: '#495057', marginBottom: '15px' }}>📝 Gelişmiş Soru Formatı Rehberi:</h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h5 style={{ color: '#28a745' }}>✅ Desteklenen Formatlar:</h5>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li><strong>Uzun Sorular:</strong> Birden fazla satıra yazılabilir</li>
              <li><strong>Seçenek Formatları:</strong> a), a-, a. hepsi geçerli</li>
              <li><strong>Cevap Formatları:</strong> "cevap: a", "Cevap: b", "CEVAP: c"</li>
              <li><strong>Uzun Seçenekler:</strong> Seçenekler de çok satırlı olabilir</li>
              <li><strong>Boş Satırlar:</strong> Sorular arası boşluk bırakabilirsiniz</li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#dc3545' }}>❌ Dikkat Edilecekler:</h5>
            <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>Her soru mutlaka <strong>soru işareti (?)</strong> ile bitmeli</li>
              <li>Tüm seçenekler (a, b, c, d) dolu olmalı</li>
              <li>Cevap mutlaka a, b, c, d'den biri olmalı</li>
              <li>Maksimum 20 soru ekleyebilirsiniz</li>
              <li>Özel karakterler (", ', \) sorun çıkarabilir</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #bee5eb' }}>
          <strong style={{ color: '#0c5460' }}>💡 İpucu:</strong>
          <span style={{ color: '#0c5460', fontSize: '14px' }}> Soruları yapıştırmadan önce bir metin editöründe kontrol edin. Sistem otomatik olarak geçersiz soruları filtreler ve size bilgi verir.</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;