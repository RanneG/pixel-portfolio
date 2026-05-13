# 8-Bit Retro Portfolio Website

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A responsive, retro gaming-themed personal portfolio website built with React, TypeScript, and Tailwind CSS. Features a classic NES/arcade game interface with modern functionality.

## Third-party UI

The Matrix rain background and glass terminal shell are adapted from components on [Uiverse.io](https://uiverse.io) (authors **whoisyourdeadie** and **louloudev59**). The bottom-right tri-action fan dock (settings / social) is adapted from Uiverse (**GreyD097**). Verify each component’s license on Uiverse before commercial use; attribution is kept in source comments.

## 🚀 Live Demo

**🌐 Live:** [rannegerodias.com](https://rannegerodias.com)

**⚡ Vercel:** [rannegerodias.vercel.app](https://rannegerodias.vercel.app)

## ⚡ Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RanneG/pixel-portfolio)

**One-click deploy to Vercel** - Click the button above to deploy this portfolio to Vercel instantly!

## 📸 Screenshots

| Desktop View | Mobile View |
|--------------|-------------|
| ![Desktop Screenshot](screenshots/desktop.png) | ![Mobile Screenshot](screenshots/mobile.png) |

> **Note:** Add actual screenshots to `/screenshots` folder after deployment

## Features

- 🎮 **Retro Design**: Classic 8-bit gaming aesthetic with neon glows and pixel-perfect styling
- 📱 **Fully Responsive**: Mobile-first design with optimized layouts for all screen sizes
- ⚙️ **Settings Panel**: Choose terminal vs browse site view and language
- 🎯 **Working Contact Form**: Integrated with Formspree for email submissions
- 🎨 **Accessibility**: ARIA labels, keyboard navigation, skip links, and reduced-motion support
- ⚡ **Performance Optimized**: Code splitting, lazy loading, and reduced motion support
- 🎪 **Easter Eggs**: Konami code activation with celebration animation
- 🔧 **Customizable**: Easy-to-modify content via context providers

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RanneG/pixel-portfolio.git
cd pixel-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Browse Projects: Groq persona demo (`/api/chat`)

The **CHATBOT RAG CORE** card on **Browse → Projects** embeds a streaming chat that calls **`POST /api/chat`**.

**Local dev (one terminal):** Add **`GROQ_API_KEY`** to **`.env.local`** at the repo root (same key as in [Groq console](https://console.groq.com/keys)), then run **`npm run dev`**. Vite serves **`/api/chat`** itself during development — no `vercel dev` required for this route.

**Optional:** Run **`vercel dev`** if you need other Vercel routes locally (e.g. `/api/health`) the same way as production.

**Production:** Deploy to Vercel and set **`GROQ_API_KEY`** in the project environment variables.

The **chatbot-rag-core** GitHub project uses **Ollama + LlamaIndex** for document RAG locally; this portfolio widget is a small **hosted** demo of **persona / system-prompt routing**, not the same binary stack.

## Configuration

### Contact Form Setup

To enable email functionality, you need to set up Formspree:

1. Go to [Formspree.io](https://formspree.io) and create a free account
2. Create a new form and copy your form ID
3. Update `src/App.tsx` or pass the `formspreeId` prop to the `SavePoint` component:

```tsx
<SavePoint formspreeId="your-formspree-id" />
```

### Customizing Content

Edit `src/contexts/PortfolioDataContext.tsx` to customize:

- Your name, bio, and stats
- Skills and proficiency levels
- Projects and links
- Contact information
- Social media URLs

Or pass custom data via props to individual components.

### Environment Variables (Optional)

Create a `.env` file for sensitive configuration:

```env
VITE_FORMSPREE_ID=your-formspree-id
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
```

## 📊 Analytics & SEO

### Analytics Setup

This portfolio includes privacy-friendly analytics using **Plausible Analytics** (or Google Analytics 4).

#### Plausible Analytics (Recommended)

1. Sign up at [Plausible.io](https://plausible.io)
2. Add your domain
3. Set environment variables:
   ```env
   VITE_ANALYTICS_PROVIDER=plausible
   VITE_PLAUSIBLE_DOMAIN=yourdomain.com
   ```

#### Google Analytics 4

1. Create a GA4 property in [Google Analytics](https://analytics.google.com)
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Set environment variables:
   ```env
   VITE_ANALYTICS_PROVIDER=ga4
   VITE_GA4_ID=G-XXXXXXXXXX
   ```

### Tracked Events

The portfolio automatically tracks:
- **Project clicks** - When users click GitHub/Live Demo links
- **Contact form submissions** - Form submissions
- **Konami code activations** - Secret code entries
- **Theme changes** - When users switch themes
- **Section views** - Navigation between sections
- **Share events** - Social sharing and link copying
- **Web Vitals** - Core Web Vitals (LCP, FID, CLS, FCP)

### Privacy & GDPR Compliance

- ✅ Respects **Do Not Track** (DNT) header
- ✅ **No cookies** used (Plausible)
- ✅ **IP anonymization** enabled (GA4)
- ✅ **GDPR compliant** - No personal data collected
- ✅ Users can opt-out via browser settings

### SEO Features

- ✅ **Open Graph** meta tags for social sharing
- ✅ **Twitter Card** support
- ✅ **Structured Data** (JSON-LD) for search engines
- ✅ **Sitemap.xml** for search engine indexing
- ✅ **Robots.txt** for crawler control
- ✅ **Semantic HTML** for better indexing

### Performance Monitoring

- ✅ **Core Web Vitals** tracking (LCP, FID, CLS, FCP)
- ✅ Real User Monitoring (RUM)
- ✅ Performance metrics stored locally
- ✅ Analytics integration for performance data

### Social Sharing

- ✅ **Share buttons** on project cards
- ✅ **Web Share API** support (native sharing)
- ✅ **Copy link** functionality
- ✅ **Social preview images** (Open Graph)

### Analytics Dashboard

View your analytics at:
- **Plausible**: [yourdomain.com/plausible](https://plausible.io) (if using Plausible)
- **Google Analytics**: [analytics.google.com](https://analytics.google.com) (if using GA4)

### Updating SEO Data

Edit `src/App.tsx` to update SEO meta tags and structured data, or modify `public/data/config.json` for site-wide settings.

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── CharacterStats.tsx
│   ├── SkillInventory.tsx
│   ├── QuestLog.tsx
│   ├── SavePoint.tsx
│   ├── Footer.tsx
│   ├── SettingsPanel.tsx
│   ├── KonamiCode.tsx
│   └── SkipToContent.tsx
├── contexts/            # React contexts
│   ├── SettingsContext.tsx
│   └── PortfolioDataContext.tsx
├── types/               # TypeScript types
│   └── index.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Breakdown

### Settings Panel

Access via the gear icon (⚙) in the bottom-right corner:

- **Site view**: Switch between the terminal home and the browse experience
- **Language**: UI language preference where applicable

### Konami Code Easter Egg

Type the Konami code sequence: ↑ ↑ ↓ ↓ ← → ← → B A

Triggers a celebration animation and secret message!

### Accessibility

- Skip to content link (visible on focus)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Reduced motion support (respects `prefers-reduced-motion`)

### Mobile Optimizations

- Touch-friendly buttons (minimum 44px height)
- Responsive navigation with mobile menu
- Mobile-friendly HP/MP bars
- Optimized text sizes for readability
- Simplified layouts on small screens

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting with React.lazy
- Optimized animations (respects reduced motion)
- Efficient re-renders with React context
- Lazy-loaded settings panel

## Customization Guide

### Changing Colors

Edit `tailwind.config.cjs` to modify the color palette:

```js
colors: {
  bg: "hsl(240 10% 4%)",
  primary: "hsl(180 100% 50%)",
  // ... etc
}
```

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add it to `App.tsx`
3. Add navigation link in `Navigation.tsx`

### Modifying Animations

Edit `src/index.css` to customize animations and effects.

## License

MIT License - feel free to use this for your own portfolio!

## Credits

- Fonts: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P), [VT323](https://fonts.google.com/specimen/VT323)
- Design inspiration: Classic NES/Arcade games

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/RanneG/pixel-portfolio/issues).

### How to Contribute

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Don't forget to give the project a star ⭐ if you find it helpful!

---

**Built with ❤️ and ☕**

