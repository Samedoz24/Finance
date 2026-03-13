💰 Finance - Kişisel Gider Takip Uygulaması
📖 Proje Nedir?
Bu proje, günlük harcamalarınızı kolayca takip edebileceğiniz, modern ve kullanımı çok basit bir mobil uygulamadır. Paranızı nereye harcadığınızı görmek ve kişisel bütçenizi yönetmek için tasarlanmıştır.

✨ Uygulamanın Özellikleri Neler?
📊 Pasta Grafik ile Görselleştirme
Harcamalarınızı sadece sıkıcı bir liste olarak değil, renkli bir pasta grafik üzerinde görerek hangi kategoriye ne kadar para harcadığınızı bir bakışta anlayabilirsiniz.

📅 Kolay Tarih Seçimi (Takvim)
Harcama eklerken takvim üzerinden çok kolay bir şekilde tarih seçebilirsiniz. Böylece geçmişe veya bugüne ait harcamalarınızı rahatça kaydedebilirsiniz.

🌓 Gece ve Gündüz Modu (Tema Desteği)
Gözlerinizi yormamak veya şarjdan tasarruf etmek için tek bir tuşla uygulamanın renklerini Karanlık (Dark) veya Aydınlık (Light) mod olarak değiştirebilirsiniz.

🛡️ Akıllı Hata Kontrolü
Yanlışlıkla boş bir harcama eklemenizi veya hatalı bir bilgi girmenizi engelleyen bir güvenlik sistemi vardır. Sizi doğru bilgiyi girmeye yönlendirir.

🍔 Harcama Kategorileri
Harcamalarınızı "Yemek", "Ulaşım", "Market" ve "Diğer" gibi gruplara ayırarak çok daha düzenli bir takip yapabilirsiniz.

💻 Hangi Teknolojiler Kullanıldı?
⚛️ React Native
Uygulamanın hem iOS (iPhone) hem de Android telefonlarda sorunsuz çalışmasını sağlayan çok popüler bir mobil yazılım iskeletidir.

🚀 Expo
React Native ile uygulama geliştirmeyi, test etmeyi ve çalıştırmayı çok daha hızlı ve kolay hale getiren harika bir yardımcı araçtır.

🟨 JavaScript
Uygulamanın arka plandaki tüm çalışma mantığının ve kurallarının yazıldığı temel programlama dilidir.

🚀 Bilgisayarımda Nasıl Çalıştırırım?
Projeyi kendi bilgisayarınızda açıp denemek isterseniz, aşağıdaki basit adımları sırasıyla izleyebilirsiniz:

📥 1. Adım: Projeyi Bilgisayarına İndir
Öncelikle projeyi bilgisayarına alman gerekiyor. Terminali (komut satırını) aç ve şu komutu yazarak projeyi kopyala:

Bash
git clone https://github.com/Samedoz24/Finance.git
📦 2. Adım: Gerekli Paketleri Yükle
Projenin çalışması için bazı dış kütüphanelere ihtiyacı var. Proje klasörünün içine gir ve şu komutu çalıştırarak o paketleri indir:

Bash
cd Finance
npm install
▶️ 3. Adım: Uygulamayı Başlat
Her şey hazır! Artık uygulamayı ayağa kaldırabilirsin. Şu komutu yaz:

Bash
npx expo start
(Not: Bu komuttan sonra ekranda bir QR kod çıkacaktır. Telefonuna "Expo Go" uygulamasını indirip kameranla bu QR kodu okutarak uygulamayı kendi telefonunda canlı olarak test edebilirsin!)

📁 Proje Klasör Yapısı (İçerik Rehberi)
🖼️ assets
Uygulama içinde kullanılan resimler, ikonlar veya özel yazı tipleri gibi görsel dosyaların saklandığı yerdir.

🧩 components
Butonlar, bilgi kartları veya listeler gibi uygulamanın birden fazla yerinde tekrar tekrar kullanılan küçük yapboz parçalarının bulunduğu klasördür.

📌 constants
Renk kodları, boyutlar veya sabit yazılar gibi uygulama genelinde hiç değişmeyen kalıcı bilgilerin tutulduğu yerdir.

📱 screens
Uygulamanın ana sayfalarını temsil eder (Örneğin; Ana sayfa ekranı, Harcama Ekleme ekranı gibi).

💾 store
Uygulamanın hafızasıdır. Harcamaların, kategorilerin ve durumların (state) uygulama açıkken geçici olarak tutulduğu ve yönetildiği merkezdir.

🛠️ util
Tarihleri düzgün göstermek veya matematiksel hesaplamalar yapmak gibi her yerde işe yarayan küçük yardımcı araçların (fonksiyonların) bulunduğu klasördür.
