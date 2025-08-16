import React from 'react';
import './InfoBankPopup.css';

const InfoBankPopup = ({ isOpen, onClose, contentType }) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (contentType) {
      case 'career':
        return (
          <div className="info-bank-popup-content">
            <h2>HOOWELL GLOBAL KARİYER SEVİYELERİ</h2>
            
            <div className="highlight">
              <h3>BAŞLANGIÇ NOKTASI : BRONZE İŞ ORTAĞI</h3>
              <p>Franchise Sahibi <strong>İLK ŞAHSİ SATIŞINI</strong> yaptıktan sonra <strong>BRONZE İŞ ORTAĞI</strong> olarak kabül edilir.</p>
            </div>

            <h3>SILVER İŞ ORTAĞI KARİYERİNE NASIL YÜKSELİRSİNİZ ?</h3>
            <p><strong>Kariyer Puanı HEDEFİ :</strong> Silver İŞ ORTAĞI Kariyerine ulaşmak için <strong>15.000 KKP</strong> toplamanız gerekir.</p>
            <p><strong>Yeni Aktif İş Ortağı HEDEFİ :</strong> En az <strong>1 adet</strong> sizin SPONSORLUĞUNUZDA AKTİF İŞ ORTAĞINA sahip olmanız gerekir.</p>

            <h3>GOLD İŞ ORTAĞI KARİYERİNE NASIL YÜKSELİRSİNİZ ?</h3>
            <p><strong>Kariyer Puanı HEDEFİ :</strong> Gold İŞ ORTAĞI Kariyerine ulaşmak için <strong>50.000 KKP</strong> toplamanız gerekir.</p>
            <p><strong>Yeni Aktif İş Ortağı HEDEFİ :</strong> En az <strong>3 adet</strong> sizin SPONSORLUĞUNUZDA AKTİF İŞ ORTAKLARINA sahip olmanız gerekir.</p>

            <h3>STAR LİDER KARİYERİNE NASIL YÜKSELİRSİNİZ ?</h3>
            <p><strong>Kariyer Puanı HEDEFİ :</strong> Star LİDER Kariyerine ulaşmak için <strong>100.000 KKP</strong> toplamanız gerekir.</p>
            <p><strong>Yeni Aktif İş Ortağı HEDEFİ :</strong> En az <strong>7 adet</strong> sizin SPONSORLUĞUNUZDA AKTİF İŞ ORTAKLARINA sahip olmanız gerekir.</p>

            <h3>SÜPER STAR LİDER KARİYERİNE NASIL YÜKSELİRSİNİZ ?</h3>
            <p><strong>Kariyer Puanı HEDEFİ :</strong> Süper STAR LİDER Kariyerine ulaşmak için <strong>175.000 KKP</strong> toplamanız gerekir.</p>
            <p><strong>Yeni Aktif İş Ortağı HEDEFİ :</strong> En az <strong>15 adet</strong> sizin SPONSORLUĞUNUZDA AKTİF İŞ ORTAKLARINA sahip olmanız gerekir.</p>

            <h3>BAŞKANLAR TAKIMI KARİYERİNE NASIL YÜKSELİRSİNİZ ?</h3>
            <p><strong>Kariyer Puanı HEDEFİ :</strong> BAŞKANLAR TAKIMI Kariyerine ulaşmak için <strong>300.000 KKP</strong> toplamanız gerekir.</p>
            <p><strong>Yeni Aktif İş Ortağı HEDEFİ :</strong> En az <strong>25 adet</strong> sizin SPONSORLUĞUNUZDA AKTİF İŞ ORTAKLARINA sahip olmanız gerekir.</p>

            <h3>ÜLKE DİSTRİBÜTÖRÜ OLMAYA NASIL HAK KAZANIRSINIZ ?</h3>
            <p><strong>Kariyer Puanı HEDEFİ :</strong> ÜLKE DİSTRİBÜTÖRÜ olabilmek için <strong>400.000 KKP</strong> toplamanız gerekir.</p>
            <p><strong>Yeni Aktif İş Ortağı HEDEFİ :</strong> En az <strong>30 adet</strong> sizin SPONSORLUĞUNUZDA AKTİF İŞ ORTAKLARINA sahip olmanız gerekir.</p>

            <div className="bonus-section">
              <h2>KARİYER ATLAMA BONUSLARI / GÜNLÜK</h2>
              <p><strong>AMAÇ :</strong> Kariyer Atlayan iş ortağını ödüllendirmektir.</p>
              <p>Ürün satışlarından gelen Kariyer ve Kazanç Puanları toplanarak kariyer atlayacak ve <strong>KARİYER ATLAMA ÖDÜLÜ</strong> olarak <strong>TEK SEFERE MAHSUS</strong> aşağıdaki 4 özel bonusu kazanacaksınız.</p>
              
              <div className="bonus-item">
                <strong>Silver Kariyer Bonusu :</strong> 15.000 KKP'ye ulaştığınızda <strong>400 $</strong>
              </div>
              <div className="bonus-item">
                <strong>Gold Kariyer Bonusu :</strong> 45.000 KKP'ye ulaştığınızda <strong>800 $</strong>
              </div>
              <div className="bonus-item">
                <strong>Star LİDER Kariyer Bonusu :</strong> 90.000 KKP'ye ulaştığınızda <strong>1.200 $</strong>
              </div>
              <div className="bonus-item">
                <strong>Süper Star LİDER Kariyer Bonusu :</strong> 150.000 KKP'ye ulaştığınızda <strong>1.600 $</strong> kazanırsınız
              </div>
            </div>
          </div>
        );

      case 'doping':
        return (
          <div className="info-bank-popup-content">
            <h2>1.8 HIZLI BAŞLAYANLARA ÖZEL, KARİYER ATLAMA PROMOSYONU = KARİYER DOPİNG PROMOSYONU</h2>
            
            <div className="highlight">
              <h3>AMAÇ</h3>
              <p>Hoowell ile çok <strong>HIZLI BAŞLANGIÇ</strong> yapan kişileri ödüllendirmek.</p>
            </div>

            <p>Her iş ortağının işe başladıktan sonra <strong>2 adet KARİYER PUANLARINI KATLAMA</strong> fırsatı vardır.</p>

            <div className="bonus-section">
              <h3>1. ADIM</h3>
              <p><strong>İLK 60 GÜN</strong> içinde TAKIMINA en az <strong>7 AKTİF İŞ ORTAĞI</strong> bulan ve en az <strong>40 adet</strong> Hoowell Hybrid Alkali İyonizer cihazını TAKIMI ile beraber satan kişilerin ilk 60 günde yaptıkları <strong>KARİYER PUANLARI 2 ile çarpılır</strong>.</p>
            </div>

            <div className="bonus-section">
              <h3>2. ADIM</h3>
              <p><strong>İLK 120 GÜN</strong> içinde TAKIMINA en az <strong>15 AKTİF İŞ ORTAĞI</strong> bulan ve <strong>61. Gün ila 120.gün</strong> arasında en az <strong>80 adet</strong> Hoowell Hybrid Alkali İyonizer cihazını TAKIMI ile beraber satan kişilerin 61. Gün ila 120.gün arasında yaptıkları <strong>KARİYER PUANLARI 2 ile çarpılır</strong>.</p>
            </div>

            <div className="highlight">
              <h3>ÖNEMLİ NOTLAR</h3>
              <p>Her 2 adımda birbirinden <strong>bağımsız</strong> olarak işler. <strong>1.ADIMI kaçıran</strong> biri <strong>2. ADIMI yakaladığı</strong> takdirde puanlarını ikiye katlar.</p>
              <p>Bu <strong>istisnai durumdur</strong> ve doğal olarak bazı kariyerler çok hızlı geçilir. Bu LİDERİ şirketimize getiren kişinin <strong>ORTAK BULMA gelirlerinde hiçbir kayıp oluşmaz</strong>.</p>
            </div>
          </div>
        );

      case 'sales':
        return (
          <div className="info-bank-popup-content">
            <h2>SATIŞLARIN İŞLEME ALINMA ve KOMİSYONLARIN ÖDENME SÜRECİ</h2>
            
            <div className="highlight">
              <p>Her yapılan satış <strong>iade süresi dolana kadar 15 GÜN BEKLEME ODASINDA</strong> işleme alınmadan bekler. 15 günü dolan siparişlerin artık iade edilmesi kanunen imkânsız olduğu için işleme alınır ve bu satışlardan oluşan komisyonlar sisteme yansıtılır.</p>
            </div>

            <div className="bonus-section">
              <h3>ÖDEME TARİHLERİ</h3>
              <p><strong>SATIŞ ve YENİ ORTAK BULMA KAZANÇLARI</strong> 15.GÜNDE, <strong>Aylık ve Yıllık bonuslar</strong> ise her ayın <strong>9.unda</strong> ödenecektir.</p>
            </div>

            <div className="bonus-section">
              <h3>AYLIK AKTİFLİK KURALI</h3>
              <p>İş Ortağının o ay içinde <strong>AKTİF</strong> olması için:</p>
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Ya <strong>ŞAHSİ</strong> olarak en az <strong>1 adet ÜRÜN</strong> satması</li>
                <li>Ya da Kendisinin bulduğu <strong>YENİ BİR İŞ ORTAĞININ</strong> ilk <strong>SATIŞINI</strong> yapması gerekir.</li>
              </ul>
              <p style={{ marginTop: '15px' }}><strong>Satışlar 15. günde AKTİFLEŞTİKTEN sonra</strong> aktiflik kotanıza sayılacaktır.</p>
              <p><strong>İş ortağı bulma geliri HARİÇ</strong>, diğer tüm gelir kapıları için <strong>DÜZENLİ AKTİF</strong> olmak gerekmektedir.</p>
              <p><strong>İşe yeni başlayan kişiler</strong>, içindeki <strong>YARIM AY ve SONRASINDA</strong> aktif sayılırlar.</p>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="info-bank-popup-content">
            <h2>HOOWELL MEMNUN MÜŞTERİ PROGRAMI İŞLEYİŞ SİSTEMATİĞİ</h2>
            
            <p>Hoowell olarak müşteri memnuniyeti sağlamak için özel bir programımız var.</p>
            
            <p>Bu program sürecinde MÜŞTERİ ile MÜŞTERİ HİZMETLERİ beraber çalışır , gerekli durumlarda SATICIDAN destek alınır.</p>
            
            <p>Müşterinizin siparişini WEB OFİSİNİZDEN girerken karşınıza çıkan SİPARİŞ FORMUNU tam olarak doldurun.</p>
            
            <p>Bu formun en altında müşterinin REFERANSLARINI yazabileceğiniz bir bölüm göreceksiniz.</p>
            
            <p>Bu referanslar sayesinde müşterinize özel bir HEDİYE PROGRAMI başlatabilirsiniz.</p>
            
            <p>Bu referanslar sizin WEB OFİSİNİZDEKİ, müşteri takip platformuna ve Hoowell MÜŞTERİ HİZMETLERİNE anında düşecektir.</p>
            
            <p>Müşteri bizlere MÜŞTERİ HİZMETLERİNE ulaşarak,EXTRA REFERANS verebilir ve bu referansları MÜŞTERİ HİZMETLERİ SATICIYA ulaştırır ve SATICI referansları arayarak SATIŞ YAPMAYA çalışır.</p>
            
            <p>Bu referansları müşteriniz de arayarak size yeni randevu ayarlayabilir.</p>
            
            <p>Ya da Müşteri bize HAZIR SATIŞ verir ve MÜŞTERİ HİZMETLERİ bu hazır satışı arayarak SATIŞI gerçekleştirir.</p>

            <div className="bonus-section">
              <h3>HOOWELL MEMNUN MÜŞTERİ PROGRAMINDAN MÜŞTERİLER NELER KAZANACAK?</h3>
              
              <p>Bu referanslardan satış çıktıkça siz prim kazanırken onlarda aşağıdaki ödülleri kazanırlar.</p>
              
              <div className="bonus-item">
                <strong>1.SATIŞTA:</strong> Bir sonraki filtre değişiminde 400 € değerindeki FİLTRE SETİNİN BEDAVA alma hakkı kazanır.
              </div>
              
              <div className="bonus-item">
                <strong>2. SATIŞTA:</strong> Bir adet ALKALİ İONİZER EL TERMİNALİ kazanırlar.
              </div>
              
              <div className="bonus-item">
                <strong>3.SATIŞTA:</strong> Bedava FRANCHAISE alma hakkı alarak Hoowell'de çalışma fırsatını yakalarlar.
              </div>
              
              <p>Bu hediyeleri Hoowell zaman içerisinde değiştirme hakkına sahiptir.</p>
              
              <p>Tüm bu kazançlar müşterinin yaptırdığı satışın üzerinden <strong>15 GÜN GEÇTİKTEN SONRA AKTİF</strong> olacaktır.</p>
            </div>

            <div className="highlight">
              <p>Memnun müşteri programı ilişkinizi güçlendirmek için kullanabileceğiniz çok önemli bir araçtır.</p>
              
              <p>Müşterileriniz ilk 60 gün için <strong>SADAKAT PROGRAMI</strong> ile sizin için koruma altına alınmıştır.</p>
              
              <p>Yani 60 gün boyunca başka bir Hoowell iş ortağından ürün alamazlar.</p>
              
              <p>Eğer Hoowell ile iş ortaklığı yapacaklarsa ilk 60 günde sadece sizinle el sıkışabilirler.</p>
              
              <p>61 günden itibaren bu müşteri istediği kişiden ürün satın alabilir ya da başka biri ile el sıkışabilir.</p>
            </div>
          </div>
        );

      case 'sponsorship':
        return (
          <div className="info-bank-popup-content">
            <h2>ORTAKLIK BONUSU / 15.GÜNDE KAZANILIR</h2>
            
            <p>SADECE 1 ADET ŞAHSİ SATIŞINIZ varsa getirdiğiniz kişiler satış yaptıkça onların satışından aşağıdaki mekanikler ile düzenli olarak para kazanabilirsiniz.</p>
            
            <p>Yeni İş Ortağınız 1 adet satış yaptığı ve bu satış 15 gün sonra KESİNLEŞTİĞİ an AKTİFLEŞMİŞ olur. Bu sayede SİZ de Ortaklık Bonusu 'nu kazanma hak edersiniz.</p>
            
            <p>Ortaklık bonusunu kazanmak için O AY içinde AKTİF olmanız GEREKMEZ.</p>
            
            <p>Sizin getirdiğiniz iş ortağının her kariyer basamağında o kişiden kazanabileceğiniz maksimum gelirler aşağıda belirtilmiştir.</p>
            
            <p>İŞ ORTAĞINIZ BAŞKANLAR TAKIMI kariyerine geldiğinde bu kişiden kazanacağınız ortaklık bonusu sona ermiş olur.</p>

            <div className="bonus-section">
              <div className="bonus-item">
                <strong>Bronze İş Ortağınız:</strong> Her satışında yarattığı KKP üzerinden <strong>% 5</strong> Ortaklık Bonusu kazanmaya başlarsınız. Ortağınız Bronze seviyesindeyken yaptığı satışlardan <strong>TOPLAM 750 $</strong> kazanabilirsiniz. Bu gelire ulaştığınızda ortağınız kariyerini yükseltene kadar ORTAKLIK BONUSU kazançlarınız durur. İş Ortağınızın kariyeri yükseldiğinde kazançlarınız tekrar başlar.
              </div>
              
              <div className="bonus-item">
                <strong>Silver İş Ortağınız:</strong> Her satışında yarattığı KKP üzerinden <strong>% 4</strong> Ortaklık Bonusu kazanmaya devam edersiniz. Ortağınız Silver İŞ ORTAĞI seviyesindeyken yaptığı satışlardan <strong>TOPLAM 1.200 $</strong> kazanabilirsiniz. Bu gelire ulaştığınızda ortağınız kariyerini yükseltene kadar ORTAKLIK BONUSU kazançlarınız durur. İş Ortağınızın kariyeri yükseldiğinde kazançlarınız tekrar başlar.
              </div>
              
              <div className="bonus-item">
                <strong>Gold İş Ortağınız:</strong> Her satışında yarattığı KKP üzerinden <strong>% 3</strong> Ortaklık Bonusu kazanmaya devam edersiniz. Ortağınız Gold İŞ ORTAĞI seviyesindeyken yaptığı satışlardan <strong>TOPLAM 1.350 $</strong> kazanabilirsiniz. Bu gelire ulaştığınızda ortağınız kariyerini yükseltene kadar ORTAKLIK BONUSU kazançlarınız durur. İş Ortağınızın kariyeri yükseldiğinde kazançlarınız tekrar başlar.
              </div>
              
              <div className="bonus-item">
                <strong>Star Lider İş Ortağınız:</strong> Her satışında yarattığı KKP üzerinden <strong>% 2</strong> Ortaklık Bonusu kazanmaya devam edersiniz. Ortağınız Star LİDER seviyesindeyken yaptığı satışlardan <strong>TOPLAM 1.200 $</strong> kazanabilirsiniz. Bu gelire ulaştığınızda ortağınız kariyerini yükseltene kadar ORTAKLIK BONUSU kazançlarınız durur. İş Ortağınızın kariyeri yükseldiğinde kazançlarınız tekrar başlar.
              </div>
              
              <div className="bonus-item">
                <strong>Süper Star Lider İş Ortağınız:</strong> Her satışında yarattığı KKP üzerinden <strong>% 1</strong> Ortaklık Bonusu kazanmaya devam edersiniz. Ortağınız Süper Star LİDER seviyesindeyken yaptığı satışlardan <strong>TOPLAM 750 $</strong> kazanabilirsiniz.
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="info-bank-popup-content">
            <h2>FRANCHISE AĞI GELİRLERİ / AYLIK</h2>
            
            <div className="highlight">
              <h3>AMAÇ</h3>
              <p>Kendi TAKIMINI kuran, iş ortağını ödüllendirmektir.</p>
            </div>
            
            <p>Yeni İş Ortakları bulduğunuz sürece, sizden başlayan ve aşağıya doğru büyüyen ticari hatlarınız oluşur. Sizin başlattığınız bu ticaretten her ay FRANCHISE AĞI GELİRLERİNİZ oluşacak.</p>
            
            <p>Bu geliri elde etmeye başlamak için <strong>SILVER İŞ ORTAĞI</strong> seviyesine yükselmiş ve o ay içinde <strong>AKTİF</strong> olmanız gerekmektedir.</p>
            
            <p>Franchise Ağı Gelirleri dağıtılırken, bizzat sizin sponsorluğunuzdaki hatlarınızın kariyer seviyesi ve o hafta içinde sizin kariyerinize göre kazanç elde edersiniz.</p>

            <div className="bonus-section">
              <h3>Kariyer seviyenize göre Franchise Ağı hak ediş yüzleriniz aşağıdaki gibidir:</h3>
              
              <div className="bonus-item">
                <strong>Silver İŞ ORTAĞI:</strong> % 2
              </div>
              
              <div className="bonus-item">
                <strong>Gold İŞ ORTAĞI:</strong> % 4
              </div>
              
              <div className="bonus-item">
                <strong>Star LİDER:</strong> % 6
              </div>
              
              <div className="bonus-item">
                <strong>Super Star LİDER:</strong> % 8
              </div>
              
              <div className="bonus-item">
                <strong>Başkanlık Takımı:</strong> % 10
              </div>
            </div>

            <div className="highlight">
              <p>Sizin sponsorluğunuzdaki bir hatta sizinle <strong>AYNI ya da DAHA YÜKSEK KARİYERDE</strong> biri varsa o hattan FRANCHISE geliri alamazsınız.</p>
              
              <p>Franchise Ağı Kazançları dağıtılırken ilk önce o ay içinde siz ve size ait ticaretinizdeki herkesin kariyer seviyesine bakılır. Kazançlar <strong>aşağıdan yukarıya doğru</strong> dağıtım yapılır.</p>
            </div>
          </div>
        );

      case 'leadership':
        return (
          <div className="info-bank-popup-content">
            <h2>AYLIK CİRO PAYLAŞIM HAVUZU GELİRLERİ / AYLIK KAZANÇ</h2>
            
            <div className="highlight">
              <h3>AMAÇ</h3>
              <p>LİDERLEŞEN iş ortağını ödüllendirmektir.</p>
            </div>

            <div className="bonus-section">
              <h3>1. Bölüm: LİDERLİK HAVUZU</h3>
              
              <p>Liderlik havuzu FRANCHISE KAZANÇLARININ TAMAMLAYICISI olarak dizayn edilmiştir. <strong>STAR LİDER / SÜPER STAR LİDER</strong> kariyerlerine açıktır.</p>
              
              <p>STAR LİDER ve SÜPER STAR LİDER kariyerindeki kişiler bu havuzda biriken parayı paylaşırlar.</p>
              
              <div className="bonus-item">
                <strong>Şartlar:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>O ay içinde AKTİF olmanız gerekir</li>
                  <li>Bu havuza girmek için o ay içinde minimum 5 Aksiyon Puanı toplamanız gerekir</li>
                  <li>Her gerçekleştirilen satış için = 1 Aksiyon Puanı</li>
                  <li>Her Aktif Yeni İş Ortağı Kaydı için = 2 Aksiyon Puanı kazanırsınız</li>
                  <li>Bu havuzdan gelir elde ederken gelirinizi ay içinde ürettiğiniz Toplam Aksiyon Puanı belirler</li>
                </ul>
              </div>
            </div>

            <div className="bonus-section">
              <h3>LİDERLİK HAVUZU GELİR HESAPLAMA YÖNTEMİ</h3>
              
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Ulaşılan aylık cironun <strong>%0,75</strong>'i dağıtılmak üzere liderlik havuzuna konulur. Bu havuza konulacak parayı WEB OFİSİNİZDEKİ özel bir SAYAÇTAN sürekli takip edebilirsiniz.</li>
                <li>Havuza giren tüm liderlerin Aksiyon Puanları toplanır. Bu sayede toplam liderlik havuzu puanı belirlenir.</li>
                <li>O ay içinde dağıtılacak toplam para Toplam Puana bölündüğünde "1" Aksiyon Puanın o aylık değeri belirlenir.</li>
                <li>Havuza giren herkesin ay içinde ÜRETTİĞİ AKSİYON PUANI ile AYLIK AKSİYON PUAN DEĞERİ çarpılarak kişilerin gelirleri hesaplanır.</li>
              </ul>
            </div>

            <div className="bonus-section">
              <h3>2. Bölüm: BAŞKANLIK HAVUZU</h3>
              
              <p>BAŞKANLIK havuzu FRANCHISE KAZANÇLARININ TAMAMLAYICISI olarak tasarlanmıştır. <strong>BAŞKANLIK TAKIMI</strong> kariyerlerine açıktır.</p>
              
              <p>Bu havuzlardan gelir elde edebilmek için BAŞKANLIK TAKIMI kariyerinde olmanız gerekir.</p>
              
              <div className="bonus-item">
                <strong>Şartlar:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>O ay içinde AKTİF olmanız gerekir</li>
                  <li>Bu havuza girmek için o ay içinde minimum 5 Aksiyon Puanı toplamanız gerekir</li>
                  <li>Her gerçekleştirilen satış için = 1 Aksiyon Puanı</li>
                  <li>Her Aktif Yeni İş Ortağı Kaydı için = 2 Aksiyon Puanı kazanırsınız</li>
                  <li>Bu havuzdan gelir elde ederken gelirinizi ay içinde ürettiğiniz Toplam Aksiyon Puanı belirler</li>
                </ul>
              </div>
            </div>

            <div className="bonus-section">
              <h3>BAŞKANLIK HAVUZU GELİR HESAPLAMA YÖNTEMİ</h3>
              
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Ulaşılan aylık cironun <strong>% 1.25</strong>'i dağıtılmak üzere liderlik havuzuna konulur. Bu havuza konulacak parayı WEB OFİSİNİZDEKİ özel bir SAYAÇTAN sürekli takip edebilirsiniz.</li>
                <li>Havuza giren tüm liderlerin Aksiyon Puanları toplanır. Bu sayede toplam liderlik havuzu puanı belirlenir.</li>
                <li>O ay içinde dağıtılacak toplam para toplam Puana bölündüğünde "1" Aksiyon Puanın o aylık değeri belirlenir.</li>
                <li>Havuza giren herkesin ay içinde ÜRETTİĞİ AKSİYON PUANI ile AYLIK AKSİYON PUAN DEĞERİ çarpılarak kişilerin gelirleri hesaplanır.</li>
              </ul>
            </div>
          </div>
        );

      case 'profit':
        return (
          <div className="info-bank-popup-content">
            <h2>KÂR PAYLAŞIM HAVUZU KAZANÇLARI / YILLIK KAZANÇ</h2>
            
            <div className="bonus-section">
              <h3>Bölüm: SATIŞ ŞAMPİYONLARI KAR PAYLAŞIMI</h3>
              
              <div className="highlight">
                <h4>AMAÇ</h4>
                <p>Yıl içinde en çok satış yaparak diğer iş ortaklarının motivasyonunu arttıran kişileri ödüllendirmek.</p>
              </div>
              
              <p><strong>GOLD İŞ ORTAĞI</strong> ve üzeri kariyerlerdeki kişiler SATIŞ ŞAMPİYONLARI KAR PAYLAŞIMINA girebilir.</p>
              
              <div className="bonus-item">
                <strong>Şartlar:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>Bu havuza girmek için yıl içinde minimum 50 Aksiyon Puanı toplamanız gerekir</li>
                  <li>Her gerçekleştirilen SATIŞ için = 1 Aksiyon Puanı</li>
                  <li>Yıl içinde her atladığınız KARİYER SEVİYESİ = 10 Aksiyon Puanı kazandırır</li>
                  <li>Bu havuzdan gelir elde ederken gelirinizi, yıl içinde ürettiğiniz Toplam Aksiyon Puanı belirler</li>
                </ul>
              </div>
            </div>

            <div className="bonus-section">
              <h3>KÂR PAYLAŞIM SATIŞ ŞAMPİYONLARI GELİR HESAPLAMA YÖNTEMİ</h3>
              
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Bu promosyon HER YIL OCAK ayında başlar ve ARALIĞIN SON GÜNÜ biter. 15 günlük bekleme süresinden dolayı 15 Ocak'ta kesinleşir.</li>
                <li>Ulaşılan YILLIK CİRONUN <strong>% 0,5</strong>'i dağıtılmak üzere SATIŞ ŞAMPİYONLARI KAR PAYLAŞIM Havuzuna konulur. Yıl içinde her gün WEB OFİSİNİZDE bu havuzda biriken parayı anlık takip edebilirsiniz.</li>
                <li>Havuza giren TÜM LİDERLERİN AKSİYON PUANLARI toplanır. Bu sayede toplam SATIŞ ŞAMPİYONLARI PUANI belirlenir.</li>
                <li>Yıl içinde DAĞITILACAK TOPLAM PARA toplam Puana bölündüğünde "1" AKSİYON PUANIN o YILLIK DEĞERİ belirlenir.</li>
                <li>Havuza giren herkesin ay içinde ÜRETTİĞİ AKSİYON PUANI ile YILLIK AKSİYON PUAN DEĞERİ çarpılarak kişilerin gelirleri hesaplanır.</li>
                <li>Bu gelirler 1 Şubat günü HESAPLARA YANSITILIR ve 15 Şubat'ta ödenir.</li>
              </ul>
            </div>

            <div className="bonus-section">
              <h3>2. Bölüm: YENİ İŞ ORTAĞI BULMA ŞAMPİYONLARI KAR PAYLAŞIMI</h3>
              
              <div className="highlight">
                <h4>AMAÇ</h4>
                <p>Yıl içinde sürekli olarak YENİ İŞ ORTAKLARI bularak işlerini büyüten ve diğer iş ortaklarının motivasyonunu arttıran kişileri ödüllendirmek.</p>
              </div>
              
              <p><strong>GOLD İŞ ORTAĞI</strong> ve üzeri kariyerlerdeki kişiler YENİ İŞ ORTAĞI BULMA KAR PAYLAŞIMINA girebilir.</p>
              
              <div className="bonus-item">
                <strong>Şartlar:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>Bu havuza girmek için yıl içinde minimum 25 Aksiyon Puanı toplamanız ve her ay AKTİF olmanız gerekir</li>
                  <li>Yıl içinde bulduğunuz her AKTİF İŞ ORTAĞI için = 1 Aksiyon Puanı</li>
                  <li>Yıl içinde her atladığınız KARİYER SEVİYESİ = 10 Aksiyon Puanı kazandırır</li>
                  <li>Bu havuzdan gelir elde ederken gelirinizi, yıl içinde ürettiğiniz Toplam Aksiyon Puanı belirler</li>
                </ul>
              </div>
            </div>

            <div className="bonus-section">
              <h3>KÂR PAYLAŞIM ORTAK BULMA ŞAMPİYONLARI GELİR HESAPLAMA YÖNTEMİ</h3>
              
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Bu promosyon HER YIL OCAK ayında başlar ve ARALIĞIN SON GÜNÜ biter. 15 günlük bekleme süresinden dolayı 15 Ocak'ta kesinleşir.</li>
                <li>Ulaşılan YILLIK CİRONUN <strong>% 0,5</strong>'i dağıtılmak üzere SATIŞ ŞAMPİYONLARI KAR PAYLAŞIM Havuzuna konulur. Yıl içinde her gün WEB OFİSİNİZDE bu havuzda biriken parayı anlık takip edebilirsiniz.</li>
                <li>Havuza giren TÜM LİDERLERİN AKSİYON PUANLARI toplanır. Bu sayede toplam SATIŞ ŞAMPİYONLARI PUANI belirlenir.</li>
                <li>Yıl içinde DAĞITILACAK TOPLAM PARA toplam Puana bölündüğünde "1" AKSİYON PUANIN o YILLIK DEĞERİ belirlenir.</li>
                <li>Havuza giren herkesin ay içinde ÜRETTİĞİ AKSİYON PUANI ile YILLIK AKSİYON PUAN DEĞERİ çarpılarak kişilerin gelirleri hesaplanır.</li>
                <li>Bu gelirler 1 Şubat günü HESAPLARA YANSITILIR ve 15 Şubat'ta ödenir.</li>
              </ul>
            </div>

            <div className="bonus-section">
              <h3>3. Bölüm: YILIN EN İYİ LİDERLERİ KAR PAYLAŞIMI</h3>
              
              <div className="highlight">
                <h4>AMAÇ</h4>
                <p>Yıl içinde TAKIMLARINA İLHAM veren ve onları BAŞARIYA TAŞIYAN kişileri ödüllendirmek.</p>
              </div>
              
              <p><strong>Star LİDER, Süper Star LİDER ve PRESIDENT</strong> kariyerlerindeki İŞ ORTAKLARI YILIN EN İYİ LİDERLERİ KAR PAYLAŞIMINA katılabilirler.</p>
              
              <p>Yıllık Cironun <strong>%1</strong>'inden oluşan bir havuzdur. Bu havuzda biriken parayı her gün WEB OFİSİNİZDEKİ sayaçtan takip edebilirsiniz.</p>
              
              <div className="bonus-item">
                <strong>Şartlar:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>Bu havuza girmek için yıl içinde minimum 75 Aksiyon Puanı toplamanız gerekir</li>
                  <li>Her gerçekleştirilen satış için = 1 Aksiyon Puanı</li>
                  <li>Her Aktif Yeni İş Ortağı Kaydı için = 2 Aksiyon Puanı kazanırsınız</li>
                  <li>Yıl içinde her atladığınız KARİYER SEVİYESİ = 10 Aksiyon Puanı kazandırır</li>
                  <li>Bu havuzdan gelir elde ederken gelirinizi, yıl içinde ürettiğiniz Toplam Aksiyon Puanı belirler</li>
                </ul>
              </div>
            </div>

            <div className="bonus-section">
              <h3>YILIN EN İYİ LİDERLERİ KAR PAYLAŞIMI HESAPLAMA YÖNTEMİ</h3>
              
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Bu promosyon HER YIL OCAK ayında başlar ve ARALIĞIN SON GÜNÜ biter. 15 günlük bekleme süresinden dolayı 15 Ocak'ta kesinleşir.</li>
                <li>Ulaşılan YILLIK CİRONUN <strong>% 1,0</strong>'i dağıtılmak üzere SATIŞ ŞAMPİYONLARI KAR PAYLAŞIM Havuzuna konulur. Yıl içinde her gün WEB OFİSİNİZDE bu havuzda biriken parayı anlık takip edebilirsiniz.</li>
                <li>Havuza giren TÜM LİDERLERİN AKSİYON PUANLARI toplanır. Bu sayede toplam SATIŞ ŞAMPİYONLARI PUANI belirlenir.</li>
                <li>Yıl içinde DAĞITILACAK TOPLAM PARA toplam Puana bölündüğünde "1" AKSİYON PUANIN o YILLIK DEĞERİ belirlenir.</li>
                <li>Havuza giren herkesin ay içinde ÜRETTİĞİ AKSİYON PUANI ile YILLIK AKSİYON PUAN DEĞERİ çarpılarak kişilerin gelirleri hesaplanır.</li>
                <li>Bu gelirler 1 Şubat günü HESAPLARA YANSITILIR ve 15 Şubat'ta ödenir.</li>
              </ul>
            </div>
          </div>
        );

      case 'travel':
        return (
          <div className="info-bank-popup-content">
            <h2>ÖDÜL SEYAHAT PROMOSYONU / 12 AYLIK</h2>
            
            <div className="highlight">
              <h3>AMAÇ</h3>
              <p>Sistemli ve iyi çalışan iş ortağını ödüllendirmektir.</p>
            </div>
            
            <p>Hoowell firması her 12 ayda bir, <strong>5 günlük seyahat programı</strong> organize eder. Bu programa sadece promosyon döneminde aşağıdaki şartları yerine getiren kişiler katılabilir.</p>
            
            <p>Bu promosyon <strong>EYLÜL ayında başlar</strong> ve bir sonraki yıl <strong>AĞUSTOS ayında sona erer</strong>.</p>

            <div className="bonus-section">
              <h3>KATILIM ŞARTLARI</h3>
              
              <div className="bonus-item">
                <strong>Genel Şartlar:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>En az <strong>Gold İŞ ORTAĞI</strong> kariyerine ulaşmak gereklidir</li>
                  <li>12 ay içerisinde <strong>40.000 Kariyer ve Kazanç Puanına</strong> ulaşmak gereklidir</li>
                  <li>12 ay içerisinde <strong>5 adet Aktif İş Ortağına</strong> bulmuş olmak gereklidir</li>
                </ul>
              </div>
              
              <div className="bonus-item">
                <strong>Başkanlık Takımı İçin Özel Şart:</strong>
                <p>Başkanlık Takımı kariyeri için satış gerekliliği yoktur, 12 ay içerisinde <strong>15 Aktif İş Ortağına</strong> ulaşması yeterlidir.</p>
              </div>
            </div>

            <div className="bonus-section">
              <h3>EKSTRA AVANTAJLAR</h3>
              
              <div className="bonus-item">
                <strong>Ücretsiz Misafir Hakkı:</strong>
                <p>Promosyon döneminde <strong>Ekstra 25.000 Kariyer ve Kazanç Puanı</strong> üreten kişiler yanlarında <strong>1 kişiyi daha ücretsiz</strong> olarak getirebilirler.</p>
              </div>
              
              <div className="bonus-item">
                <strong>Ek Misafir Seçeneği:</strong>
                <p>Bu seyahat programını kazanan kişiler yanlarında <strong>1 kişi daha getirmek</strong> istediklerinde bunu o kişinin <strong>seyahat paketini ödeyerek</strong> de getirebilirler.</p>
              </div>
            </div>
          </div>
        );

      case 'accounting':
        return (
          <div className="info-bank-popup-content">
            <h2>OLUŞAN KAZANÇLARIN VERGİ YÜKÜMLÜLÜĞÜ</h2>
            
            <div className="bonus-section">
              <h3>6.4.1 HOOWELL Global Felsefesi</h3>
              <p>HOOWELL Global fırsatını tasarlamada, rehberlik eden felsefelerimizden biri İş Ortaklarını mümkün oldukça çok sayıda idari, işletimsel ve lojistik görevden bağımsız kılmaktır. Böyle yaparak, ürün satışları ve kayıt faaliyetleri olarak adlandırılan Bağımsız İş Ortaklıkları gelirlerini doğrudan etkileyecek faaliyetlere yoğunlaşmada serbesttir.</p>
            </div>

            <div className="bonus-section">
              <h3>6.4.2 Yasal Sorumluluk</h3>
              <p>Kaldı ki, Türk Borçlar Kanunu ve Türk Ticaret Kanunu'na göre zaten her bir İş Ortağı, kendi ticari iş ve eylemlerinden sorumludur. Bu itibarla, yapmış olduğu İş Ortaklığı faaliyeti ile ilgili her türlü vergilendirme işleminden kendisi sorumludur.</p>
            </div>

            <div className="bonus-section">
              <h3>6.4.3 Şahıs İş Ortakları İçin Vergi Kesintisi</h3>
              <p>Herhangi bir ŞİRKETİ olmayan İş Ortağının oluşan kazançları ödenirken <strong>KAYNAĞINDA STOPAJ KESİNTİSİ (%20)</strong> yapılarak ödeme yapılır. Kesilen %20'lik meblağ kişinin TC KİMLİK numarası ile her ay devlete yatırılır.</p>
            </div>

            <div className="bonus-section">
              <h3>6.4.4 Şirket Sahipleri İçin KDV Yükümlülüğü</h3>
              <p>Şahıs, Limited ya da Anonim Şirketlerin sahipleri kazanılan meblağın üzerine <strong>%20 KDV</strong> ekleyerek fatura keserler ve kendi vergilerini şirketin bünyesinde ödemekten kendileri sorumludur.</p>
            </div>
          </div>
        );
      
      // Diğer content type'lar için buraya eklenebilir
      default:
        return (
          <div className="info-bank-popup-content">
            <p>İçerik bulunamadı.</p>
          </div>
        );
    }
  };

  return (
    <div className="info-bank-popup-overlay" onClick={onClose}>
      <div className="info-bank-popup" onClick={(e) => e.stopPropagation()}>
        <div className="info-bank-popup-header">
          <button className="info-bank-popup-close" onClick={onClose}>
            ✕
          </button>
        </div>
        {getContent()}
      </div>
    </div>
  );
};

export default InfoBankPopup;

