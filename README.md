# 8-Bit Retro Portfolio Website

A responsive, retro gaming-themed personal portfolio website built with React, TypeScript, and Tailwind CSS. Features a classic NES/arcade game interface with modern functionality.

## Features

- 🎮 **Retro Design**: Classic 8-bit gaming aesthetic with neon glows and pixel-perfect styling
- 📱 **Fully Responsive**: Mobile-first design with optimized layouts for all screen sizes
- ⚙️ **Settings Panel**: Toggle CRT scanlines, sound effects, high contrast mode, and themes
- 🎯 **Working Contact Form**: Integrated with Formspree for email submissions
- 🎨 **Accessibility**: ARIA labels, keyboard navigation, skip links, and high contrast mode
- ⚡ **Performance Optimized**: Code splitting, lazy loading, and reduced motion support
- 🎪 **Easter Eggs**: Konami code activation with celebration animation
- 🔧 **Customizable**: Easy-to-modify content via context providers

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio-8bit
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
```

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

- **CRT Scanlines**: Toggle the retro scanline overlay
- **Sound Effects**: Toggle sound (ready for future implementation)
- **High Contrast**: Enhanced accessibility mode
- **Theme Switcher**: Choose between NES, Game Boy, and Arcade color palettes

### Konami Code Easter Egg

Type the Konami code sequence: ↑ ↑ ↓ ↓ ← → ← → B A

Triggers a celebration animation and secret message!

### Accessibility

- Skip to content link (visible on focus)
- ARIA labels on all interactive elements
- Keyboard navigation support
- High contrast mode
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

---

**Built with ❤️ and ☕**

