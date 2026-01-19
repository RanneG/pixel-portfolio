# Contributing Guide

Thank you for your interest in contributing to the 8-bit Portfolio project! 🎮

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/RanneG/pixel-portfolio/issues)
2. If not, create a new issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Provide as much detail as possible:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Describe the problem it solves and your proposed solution

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes:**
   - Follow the code style guidelines
   - Write or update tests
   - Update documentation if needed
4. **Test your changes:**
   ```bash
   npm run lint
   npm test
   npm run build
   ```
5. **Commit your changes:**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format
6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request:**
   - Use the PR template
   - Link to related issues
   - Provide screenshots if UI changes

## 📋 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define types/interfaces in `src/types/`
- Avoid `any` types - use proper typing
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Add PropTypes or TypeScript types

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Maintain 8-bit retro aesthetic
- Ensure mobile responsiveness

### File Structure

```
src/
├── components/     # React components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── utils/         # Utility functions
├── types/         # TypeScript types
└── App.tsx        # Main app component
```

## 🧪 Testing

### Running Tests

```bash
npm test          # Run all tests
npm run test:watch # Watch mode
```

### Writing Tests

- Write tests for new features
- Test edge cases and error handling
- Maintain or improve test coverage
- Use descriptive test names

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add share button to project cards
fix: resolve mobile menu animation issue
docs: update README with deployment instructions
```

## 🎨 Design Guidelines

### 8-Bit Retro Theme

- Maintain the retro gaming aesthetic
- Use pixel-perfect borders (no border-radius)
- Follow the color palette defined in `tailwind.config.cjs`
- Use pixel fonts (Press Start 2P) for headings
- Use retro terminal font (VT323) for body text

### Accessibility

- Always add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Test with screen readers
- Ensure color contrast meets WCAG AA standards

### Responsive Design

- Mobile-first approach
- Test on multiple screen sizes
- Ensure touch targets are at least 44px
- Optimize for performance on mobile

## 🔍 Code Review Process

1. All PRs require at least one approval
2. Code must pass CI checks (linting, tests, build)
3. Maintainers will review for:
   - Code quality
   - Performance
   - Accessibility
   - Design consistency
   - Documentation

## 🐛 Debugging

### Common Issues

**Build fails:**
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

**Styles not applying:**
- Check Tailwind config
- Verify class names are correct
- Check for CSS conflicts

**Analytics not working:**
- Verify environment variables
- Check browser console for errors
- Ensure Do Not Track is not enabled

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## ❓ Questions?

- Open an issue with the `question` label
- Check existing issues and discussions
- Review the documentation

## 🙏 Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🎮**

