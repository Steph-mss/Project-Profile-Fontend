# 🎨 Public Profile Collector - Frontend

Interface utilisateur moderne pour l'analyse de profils professionnels multi-sources.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)

---

## 📋 Vue d'ensemble

Application React moderne avec design Airbnb-inspired permettant de :
- 🔍 Rechercher un profil professionnel (prénom, nom, entreprise)
- 📊 Visualiser un score de fiabilité détaillé (0-100)
- 📈 Explorer le breakdown par critère
- 🗂️ Consulter les données sources (LinkedIn, Pappers, Societe, Web)
- 💾 Exporter les résultats en JSON

---

## ✨ Fonctionnalités

### Interface de Recherche
- ✅ Formulaire avec validation inline
- ✅ Messages d'erreur contextuels
- ✅ États de chargement avec spinner animé
- ✅ Timeout automatique après 5 minutes

### Affichage des Résultats
- ✅ Score circulaire avec code couleur dynamique
- ✅ 4 onglets : Vue d'ensemble, Profil, Sources, Données brutes
- ✅ Breakdown visuel avec barres de progression
- ✅ Justification détaillée du score
- ✅ Bouton "Nouvelle recherche"

### Design System
- 🎨 Palette Airbnb-inspired (#FF385C)
- 🌟 Glassmorphism & ombres premium
- ✨ Animations fluides (fade-in, slide-in)
- 📱 100% Responsive (mobile, tablette, desktop)
- 🔤 Typographie Inter (Google Fonts)

---

## 🚀 Installation

### Prérequis
- Node.js >= 18
- npm >= 9

### Installation des dépendances
```bash
cd frontend
npm install
```

---

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `frontend/` :

```env
# URL de l'API backend
VITE_API_URL=http://localhost:3000

# Production
# VITE_API_URL=https://votre-backend.railway.app
```

---

## 🔧 Développement

```bash
# Démarrer le serveur de dev
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Lint
npm run lint
```

**Accès** : http://localhost:5173

---

## 📁 Structure du Projet

```
frontend/
├── public/                 # Assets statiques
├── src/
│   ├── components/
│   │   ├── SearchForm.tsx      # Formulaire de recherche
│   │   ├── SearchForm.css
│   │   ├── ResultView.tsx      # Affichage résultats
│   │   └── ResultView.css
│   ├── App.tsx                 # App principale
│   ├── App.css                 # Layout global
│   ├── index.css               # Design system
│   └── main.tsx                # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System

### Palette de Couleurs
```css
--color-primary: #FF385C;           /* Airbnb Red */
--color-primary-dark: #E31C5F;
--color-primary-light: #FF5A5F;
--color-text-primary: #222222;
--color-text-secondary: #717171;
--color-background: #FFFFFF;
--color-background-secondary: #F7F7F7;
--color-border-light: #DDDDDD;
```

### Typographie
- **Font** : Inter (Google Fonts)
- **Poids** : 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Spacing System
```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px
```

### Ombres
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.07)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
--shadow-hover: 0 12px 24px rgba(0,0,0,0.15)
```

---

## 🧩 Composants

### SearchForm
Formulaire de recherche avec validation.

**Props** :
- `onSearch: (data: SearchData) => void` - Callback de soumission
- `isLoading: boolean` - État de chargement

**Features** :
- Validation inline avec messages d'erreur
- Champs désactivés pendant le chargement
- Spinner animé dans le bouton

### ResultView
Affichage des résultats avec tabs.

**Props** :
- `result: any` - Données du profil analysé
- `status: string` - Statut du job (done/failed/pending)
- `onReset?: () => void` - Callback pour nouvelle recherche

**Features** :
- Score circulaire avec couleur dynamique
- 4 onglets navigables
- Breakdown visuel par critère
- Export JSON

---

## 🔄 Flux de Données

```
User Input → SearchForm → POST /search → Job ID
    ↓
Polling GET /jobs/:id (toutes les 5s)
    ↓
Status: done → ResultView affiche les données
```

### Gestion d'État
```typescript
const [jobId, setJobId] = useState<string | null>(null);
const [status, setStatus] = useState<string>('idle');
const [result, setResult] = useState<any>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

---

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd frontend
vercel

# Production
vercel --prod
```

**Configuration Vercel** :
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL`

### Netlify

```bash
# Build local
npm run build

# Upload du dossier dist/ via Netlify UI
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

---

## 🎯 Points d'Attention

### CORS
Le backend doit autoriser l'origine du frontend :
```typescript
// Backend app.ts
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
```

### Variables d'Environnement
⚠️ **Important** : Vite ne charge que les variables préfixées par `VITE_`

```env
✅ VITE_API_URL=http://localhost:3000
❌ API_URL=http://localhost:3000  # Ne fonctionnera pas !
```

### HMR (Hot Module Replacement)
Le dev server supporte le HMR. Les changements CSS/TSX sont reflétés instantanément.

---

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend
```bash
# Vérifier que le backend tourne
curl http://localhost:3000/health

# Vérifier VITE_API_URL
echo $VITE_API_URL  # Linux/Mac
echo %VITE_API_URL%  # Windows

# Vérifier les CORS dans la console browser
```

### Build échoue
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier TypeScript
npx tsc --noEmit
```

### Styles ne s'appliquent pas
```bash
# Vider le cache Vite
rm -rf node_modules/.vite
npm run dev
```

---

## 📊 Métriques

### Performance
- ⚡ First Contentful Paint : < 1.5s
- ⚡ Time to Interactive : < 3s
- 📦 Bundle size : ~150 KB (gzipped)

### Compatibilité
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

---

## 🔗 Ressources

- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [Documentation TypeScript](https://www.typescriptlang.org)
- [Airbnb Design Language](https://airbnb.design)

---

## 📝 License

MIT

---
