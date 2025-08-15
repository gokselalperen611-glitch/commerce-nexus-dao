# CommerceDAO - Decentralized E-commerce Platform

![CommerceDAO Banner](https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&h=300)

## 🌟 Platform Özeti

CommerceDAO, geleneksel e-ticaret mağazalarını topluluk sahipliğindeki DAO (Decentralized Autonomous Organization) yapılarına dönüştüren devrim niteliğinde bir platformdur. Müşteriler token sahibi olarak işletme kararlarına katılabilir, kar paylaşımından faydalanabilir ve sanal gerçeklik ortamında alışveriş deneyimi yaşayabilir.

### 🎯 Temel Özellikler

- **🏪 Mağaza Tokenizasyonu**: E-ticaret mağazalarını DAO yapısına dönüştürme
- **🗳️ Topluluk Yönetişimi**: Token tabanlı oylama ve karar alma süreçleri
- **💰 Kar Paylaşımı**: Token sahiplerine otomatik kar dağıtımı
- **🥽 Metaverse Mağazalar**: 3D sanal gerçeklik alışveriş deneyimi
- **🔐 Güvenli Kimlik Doğrulama**: Supabase Auth + Wallet entegrasyonu
- **📊 Gelişmiş Analitik**: Gerçek zamanlı performans metrikleri

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Git

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/your-username/commerce-dao.git
cd commerce-dao

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

### Ortam Değişkenleri

`.env` dosyası oluşturun:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Teknoloji Stack'i

### Frontend
- **React 18** - Modern UI kütüphanesi
- **TypeScript** - Type-safe geliştirme
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Three Fiber** - 3D graphics ve VR
- **React Query** - Server state management

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - İlişkisel veritabanı
- **Row Level Security** - Güvenlik politikaları
- **Real-time subscriptions** - Canlı veri güncellemeleri

### Blockchain (Gelecek)
- **Ethereum** - Smart contract platform
- **Web3.js** - Blockchain etkileşimi
- **MetaMask** - Wallet entegrasyonu
- **IPFS** - Dağıtık dosya depolama

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/             # shadcn/ui bileşenleri
│   ├── MetaverseScene.tsx
│   ├── StoreCard.tsx
│   └── ...
├── pages/              # Sayfa bileşenleri
│   ├── Home.tsx
│   ├── Stores.tsx
│   ├── StoreDetail.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useWallet.ts
│   └── ...
├── integrations/       # Dış servis entegrasyonları
│   └── supabase/
├── types/              # TypeScript tip tanımları
└── data/               # Mock data ve sabitler
```

## 🎮 Kullanım Kılavuzu

### Mağaza Sahipleri İçin

1. **Hesap Oluşturma**: Email/şifre veya cüzdan ile kayıt
2. **Mağaza Bağlama**: Shopify, WooCommerce vb. entegrasyonu
3. **Token Konfigürasyonu**: Token adı, sembolü ve parametreleri
4. **Yönetişim Kurulumu**: Oylama kuralları ve kar paylaşımı
5. **Metaverse Mağaza**: 3D sanal mağaza tasarımı

### Müşteriler/Yatırımcılar İçin

1. **Platform Keşfi**: Mağazaları inceleyin ve filtreleyin
2. **Token Satın Alma**: Favori mağazalardan token edinin
3. **Yönetişime Katılım**: Tekliflere oy verin ve öneri oluşturun
4. **Metaverse Alışveriş**: VR ortamında ürünleri keşfedin
5. **Kar Paylaşımı**: Token oranınıza göre kar elde edin

## 🔧 Geliştirme

### Kod Kalitesi

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build
npm run build

# Preview production build
npm run preview
```

### Veritabanı Migrations

```bash
# Supabase CLI kurulumu
npm install -g supabase

# Local development
supabase start

# Migration oluşturma
supabase migration new migration_name

# Migration uygulama
supabase db push
```

## 🧪 Test

```bash
# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Coverage raporu
npm run test:coverage
```

## 📊 Performans Metrikleri

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔐 Güvenlik

- **Row Level Security (RLS)** - Veritabanı seviyesinde güvenlik
- **JWT Authentication** - Güvenli kimlik doğrulama
- **HTTPS Everywhere** - Şifreli veri iletimi
- **Input Validation** - XSS ve injection koruması
- **Rate Limiting** - API abuse koruması

## 🌍 Deployment

### Vercel (Önerilen)

```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Docker image oluşturma
docker build -t commerce-dao .

# Container çalıştırma
docker run -p 3000:3000 commerce-dao
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Katkı Kuralları

- Kod style guide'ına uyun
- Test coverage'ı koruyun
- Commit mesajlarını anlamlı yazın
- Documentation güncelleyin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Supabase](https://supabase.com) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics
- [Tailwind CSS](https://tailwindcss.com) - Styling

## 📞 İletişim

- **Website**: [https://commerce-dao.com](https://commerce-dao.com)
- **Email**: info@commerce-dao.com
- **Discord**: [CommerceDAO Community](https://discord.gg/commerce-dao)
- **Twitter**: [@CommerceDAO](https://twitter.com/CommerceDAO)

## 🗺️ Roadmap

### Q1 2024
- [ ] Blockchain entegrasyonu
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Q2 2024
- [ ] DeFi yield farming
- [ ] NFT marketplace
- [ ] AI-powered recommendations
- [ ] Cross-chain support

### Q3 2024
- [ ] Enterprise solutions
- [ ] API marketplace
- [ ] Advanced metaverse features
- [ ] Global expansion

---

**CommerceDAO** - E-ticaretin geleceğini bugün inşa ediyoruz! 🚀