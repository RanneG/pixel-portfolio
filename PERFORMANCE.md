# Performance Optimizations

This document outlines all performance optimizations implemented in the 8-bit portfolio.

## 🚀 Code Splitting

### Lazy Loading
- **SkillInventory**: Lazy-loaded with React.lazy()
- **QuestLog**: Lazy-loaded with React.lazy()
- **SettingsPanel**: Lazy-loaded with React.lazy()

### Loading States
- Custom loading skeletons for each lazy-loaded component
- Smooth transitions when components load

### Prefetching
- Components prefetch on navigation link hover
- Reduces perceived load time

## 🎨 Animation Performance

### CSS Optimizations
- `will-change` property on animated elements
- GPU-accelerated transforms
- Reduced animation complexity on mobile

### Scroll Performance
- Debounced scroll event listeners (10ms)
- Passive event listeners for better performance
- IntersectionObserver for scroll-based animations

## 📦 Bundle Optimization

### Manual Chunks
- React vendor chunk separated
- Component chunks for better caching
- Optimized dependency pre-bundling

### Tree Shaking
- Unused dependencies automatically removed
- ESM imports for better tree-shaking

### Bundle Analysis
Run `npm run analyze` to check bundle sizes after build.

## 🖼️ Image Optimization

### LazyImage Component
- IntersectionObserver-based lazy loading
- WebP format support with fallback
- Blur-up placeholder support
- Native `loading="lazy"` attribute

### Usage
```tsx
import { LazyImage } from "./components/LazyImage";

<LazyImage
  src="/image.png"
  webpSrc="/image.webp"
  alt="Description"
  placeholder="data:image/jpeg;base64,..."
/>
```

## 📱 PWA Features

### Service Worker
- Network-first strategy for HTML
- Cache-first for static assets
- Automatic cache cleanup
- Offline fallback to index.html

### Install Prompt
- Native "Add to Home Screen" prompt
- Custom install UI component
- Automatic detection of install capability

### Manifest
- App icons (192x192, 512x512)
- Theme colors
- Display mode: standalone
- Screenshots support

## 🔧 Utilities

### Debounce & Throttle
```tsx
import { debounce, throttle } from "./utils/debounce";

const debouncedFn = debounce(() => {
  // Your function
}, 100);

const throttledFn = throttle(() => {
  // Your function
}, 100);
```

### IntersectionObserver Hook
```tsx
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";

const [ref, isVisible] = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: "50px",
  triggerOnce: true
});
```

## 📊 Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Total Bundle Size**: < 500KB (gzipped)

### Monitoring
- Use Chrome DevTools Lighthouse
- Check Network tab for load times
- Monitor bundle sizes with `npm run analyze`

## 🎯 Best Practices

1. **Always lazy load heavy components**
2. **Use IntersectionObserver for scroll animations**
3. **Debounce/throttle event listeners**
4. **Optimize images to WebP format**
5. **Use `will-change` for animated elements**
6. **Test on slow 3G connection**
7. **Monitor bundle sizes regularly**

## 🔍 Debugging

### Check Bundle Sizes
```bash
npm run build
npm run analyze
```

### Check Service Worker
- Open Chrome DevTools → Application → Service Workers
- Check cache storage
- Test offline mode

### Performance Profiling
- Chrome DevTools → Performance tab
- Record page load
- Analyze bottlenecks

---

**Keep it fast! ⚡**

