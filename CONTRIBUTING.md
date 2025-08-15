# CommerceDAO'ya Katkıda Bulunma Rehberi

CommerceDAO projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 🎯 Katkı Türleri

### 1. Kod Katkıları
- Bug düzeltmeleri
- Yeni özellik geliştirme
- Performance iyileştirmeleri
- Test coverage artırma

### 2. Dokümantasyon
- README güncellemeleri
- API dokümantasyonu
- Tutorial yazma
- Çeviri katkıları

### 3. Tasarım
- UI/UX iyileştirmeleri
- İkon ve grafik tasarımı
- Kullanıcı deneyimi optimizasyonu

### 4. Test ve QA
- Bug raporlama
- Test senaryoları yazma
- Performance testing
- Security testing

## 🚀 Başlangıç

### 1. Repository'yi Fork Edin
```bash
# GitHub'da fork butonuna tıklayın
# Sonra local'e klonlayın
git clone https://github.com/YOUR_USERNAME/commerce-dao.git
cd commerce-dao
```

### 2. Development Environment Kurulumu
```bash
# Bağımlılıkları yükleyin
npm install

# Environment variables ayarlayın
cp .env.example .env.local

# Development server'ı başlatın
npm run dev
```

### 3. Branch Oluşturun
```bash
# Descriptive branch name kullanın
git checkout -b feature/add-wallet-integration
git checkout -b fix/authentication-bug
git checkout -b docs/update-readme
```

## 📝 Kod Standartları

### TypeScript
- Strict mode kullanın
- Proper typing yapın
- Interface'leri export edin

```typescript
// ✅ İyi
interface StoreProps {
  id: string;
  name: string;
  tokenSymbol: string;
}

// ❌ Kötü
const store: any = {
  id: "1",
  name: "Store"
};
```

### React Components
- Functional components kullanın
- Custom hooks oluşturun
- Props'ları destructure edin

```tsx
// ✅ İyi
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ Kötü
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### CSS/Styling
- Tailwind CSS kullanın
- Responsive design uygulayın
- Dark mode desteği ekleyin

```tsx
// ✅ İyi
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Store Name
  </h2>
</div>
```

## 🧪 Test Gereksinimleri

### Unit Tests
```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests
```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });
    
    expect(result.current.user).toBeTruthy();
  });
});
```

## 📋 Pull Request Süreci

### 1. Commit Mesajları
Conventional Commits formatını kullanın:

```bash
# Feature
git commit -m "feat: add wallet connection functionality"

# Bug fix
git commit -m "fix: resolve authentication redirect issue"

# Documentation
git commit -m "docs: update API documentation"

# Style
git commit -m "style: improve button hover effects"

# Refactor
git commit -m "refactor: optimize store data fetching"

# Test
git commit -m "test: add unit tests for auth hooks"
```

### 2. PR Template
Pull Request oluştururken şu template'i kullanın:

```markdown
## 📝 Açıklama
Bu PR'da neler değişti ve neden?

## 🔄 Değişiklik Türü
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Test
- [ ] Unit tests eklendi/güncellendi
- [ ] Integration tests eklendi/güncellendi
- [ ] Manual testing yapıldı

## 📸 Screenshots (UI değişiklikleri için)
Önce/Sonra ekran görüntüleri

## ✅ Checklist
- [ ] Kod self-review yapıldı
- [ ] Lint errors yok
- [ ] Tests geçiyor
- [ ] Documentation güncellendi
```

### 3. Review Süreci
- En az 2 reviewer approval gerekli
- CI/CD checks geçmeli
- Conflicts resolve edilmeli
- Documentation güncel olmalı

## 🐛 Bug Raporlama

### Issue Template
```markdown
## 🐛 Bug Açıklaması
Kısa ve net bug açıklaması

## 🔄 Reproduce Steps
1. '...' sayfasına git
2. '...' butonuna tıkla
3. '...' formunu doldur
4. Hatayı gör

## 🎯 Beklenen Davranış
Ne olması gerekiyordu?

## 📸 Screenshots
Varsa ekran görüntüleri ekleyin

## 🖥️ Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone 12, Desktop]

## 📝 Ek Bilgiler
Başka önemli detaylar
```

## 💡 Feature Request

### Template
```markdown
## 🚀 Feature Açıklaması
Yeni özellik hakkında detaylı açıklama

## 🎯 Problem
Hangi problemi çözüyor?

## 💭 Çözüm Önerisi
Nasıl çözülmesini öneriyorsunuz?

## 🔄 Alternatifler
Başka çözüm yolları düşündünüz mü?

## 📊 Öncelik
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low

## 🏷️ Labels
- enhancement
- feature-request
- needs-discussion
```

## 🎨 Design Guidelines

### UI/UX Prensipleri
1. **Consistency** - Tutarlı tasarım dili
2. **Accessibility** - WCAG 2.1 AA uyumluluğu
3. **Performance** - Hızlı yükleme süreleri
4. **Mobile-first** - Responsive tasarım

### Color Palette
```css
/* Primary Colors */
--primary: hsl(263, 70%, 50.4%);
--primary-foreground: hsl(0, 0%, 98%);

/* Secondary Colors */
--secondary: hsl(240, 5%, 13%);
--accent: hsl(12, 76%, 61%);

/* Status Colors */
--success: hsl(142, 76%, 36%);
--warning: hsl(38, 92%, 50%);
--destructive: hsl(0, 62%, 50%);
```

### Typography
```css
/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

## 🔒 Security Guidelines

### Güvenlik Kontrolleri
- Input validation
- XSS koruması
- CSRF koruması
- SQL injection koruması
- Rate limiting

### Sensitive Data
- API keys environment variables'da
- Passwords hash'lenmiş
- Personal data encrypted
- Audit logs tutulmuş

## 📚 Kaynaklar

### Dokümantasyon
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Supabase CLI](https://supabase.com/docs/reference/cli)

## 🤝 Community

### İletişim Kanalları
- **Discord**: [CommerceDAO Community](https://discord.gg/commerce-dao)
- **GitHub Discussions**: Teknik tartışmalar
- **Twitter**: [@CommerceDAO](https://twitter.com/CommerceDAO)

### Code of Conduct
- Saygılı ve kapsayıcı davranın
- Yapıcı geri bildirim verin
- Farklı görüşlere açık olun
- Yardımlaşmayı teşvik edin

## 🏆 Recognition

Katkıda bulunanlar:
- README'de mention edilir
- Contributors sayfasında listelenir
- Discord'da özel rol verilir
- Yıllık contributor awards

---

Sorularınız için GitHub Issues veya Discord kanalımızı kullanabilirsiniz. Katkılarınız için şimdiden teşekkür ederiz! 🙏