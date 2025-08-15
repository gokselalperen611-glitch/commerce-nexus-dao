# CommerceDAO Deployment Rehberi

Bu dokümantasyon, CommerceDAO platformunun farklı ortamlarda nasıl deploy edileceğini açıklar.

## 🎯 Deployment Seçenekleri

### 1. Vercel (Önerilen)
### 2. Netlify
### 3. AWS
### 4. Docker
### 5. Self-hosted

## 🚀 Vercel Deployment

### Hızlı Deployment
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables
Vercel dashboard'da aşağıdaki environment variables'ları ayarlayın:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-domain.vercel.app
```

### vercel.json Konfigürasyonu
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🌐 Netlify Deployment

### netlify.toml Konfigürasyonu
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Deploy Steps
```bash
# Netlify CLI kurulumu
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## ☁️ AWS Deployment

### S3 + CloudFront
```bash
# AWS CLI kurulumu
pip install awscli

# S3 bucket oluşturma
aws s3 mb s3://commerce-dao-app

# Build ve upload
npm run build
aws s3 sync dist/ s3://commerce-dao-app --delete

# CloudFront distribution oluşturma
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### cloudfront-config.json
```json
{
  "CallerReference": "commerce-dao-2024",
  "Comment": "CommerceDAO App Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-commerce-dao-app",
        "DomainName": "commerce-dao-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-commerce-dao-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200"
      }
    ]
  },
  "Enabled": true
}
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    server {
        listen       80;
        server_name  localhost;
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.supabase.co wss://api.supabase.co;" always;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security
        location ~ /\. {
            deny all;
        }
    }
}
```

### Docker Compose
```yaml
version: '3.8'

services:
  commerce-dao:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # Optional: Add reverse proxy
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./proxy.conf:/etc/nginx/nginx.conf
    depends_on:
      - commerce-dao
    restart: unless-stopped
```

### Build ve Run
```bash
# Docker image build
docker build -t commerce-dao .

# Container run
docker run -d -p 80:80 --name commerce-dao-app commerce-dao

# Docker Compose ile
docker-compose up -d
```

## 🏠 Self-hosted Deployment

### Ubuntu Server Setup
```bash
# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurulumu (Process Manager)
sudo npm install -g pm2

# Nginx kurulumu
sudo apt update
sudo apt install nginx

# SSL sertifikası (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

### Application Setup
```bash
# Repository clone
git clone https://github.com/your-username/commerce-dao.git
cd commerce-dao

# Dependencies install
npm install

# Build
npm run build

# PM2 ile serve
pm2 serve dist 3000 --name "commerce-dao" --spa

# PM2 startup
pm2 startup
pm2 save
```

### Nginx Konfigürasyonu
```nginx
# /etc/nginx/sites-available/commerce-dao
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Site enable
sudo ln -s /etc/nginx/sites-available/commerce-dao /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL sertifikası
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# App Configuration
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
VITE_APP_NAME=CommerceDAO

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=your-hotjar-id

# Feature Flags
VITE_ENABLE_METAVERSE=true
VITE_ENABLE_CRYPTO_PAYMENTS=false
VITE_ENABLE_AI_FEATURES=true

# API Endpoints
VITE_API_BASE_URL=https://api.your-domain.com
VITE_WEBSOCKET_URL=wss://ws.your-domain.com

# Security
VITE_CSP_NONCE=random-nonce-value
VITE_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## 📊 Monitoring ve Logging

### Health Check Endpoint
```typescript
// src/api/health.ts
export const healthCheck = async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION,
    environment: process.env.NODE_ENV,
    services: {
      supabase: await checkSupabaseConnection(),
      database: await checkDatabaseConnection()
    }
  };
};
```

### Monitoring Setup
```bash
# PM2 monitoring
pm2 install pm2-server-monit

# Log rotation
pm2 install pm2-logrotate

# Uptime monitoring
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=your-api-key&format=json&type=1&url=https://your-domain.com/health&friendly_name=CommerceDAO"
```

## 🔒 Security Checklist

### SSL/TLS
- [ ] SSL sertifikası kuruldu
- [ ] HTTPS redirect aktif
- [ ] HSTS header eklendi
- [ ] Mixed content warnings yok

### Headers
- [ ] Content Security Policy
- [ ] X-Frame-Options
- [ ] X-XSS-Protection
- [ ] X-Content-Type-Options
- [ ] Referrer-Policy

### Application Security
- [ ] Environment variables güvenli
- [ ] API keys exposed değil
- [ ] Input validation aktif
- [ ] Rate limiting uygulandı

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

#### Environment Variables
```bash
# Check if variables are loaded
echo $VITE_SUPABASE_URL

# Verify in browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
```

#### Routing Issues
```nginx
# Nginx SPA configuration
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build -- --analyze

# Check lighthouse score
npx lighthouse https://your-domain.com --output html
```

## 📈 Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          three: ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### CDN Configuration
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://your-project.supabase.co">
<link rel="dns-prefetch" href="https://api.supabase.co">
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

Bu deployment rehberi ile CommerceDAO platformunu güvenli ve performanslı bir şekilde production ortamına deploy edebilirsiniz. Sorularınız için GitHub Issues kullanabilirsiniz.