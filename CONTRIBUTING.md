# 💜 Contributing to YONI

Thank you for your interest in contributing to YONI! This guide will help you get started.

## 🌟 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YONI-app.git
   cd YONI-app
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/dein-thema
   ```
4. **Make your changes** and commit them
5. **Push to your fork**:
   ```bash
   git push -u origin feature/dein-thema
   ```
6. **Create a Pull Request**:
   ```bash
   gh pr create --fill
   ```

## 📋 Development Workflow

### Before You Start

- Read the [README.md](README.md) to understand the project
- Check existing [issues](https://github.com/pappensex/YONI-app/issues) and [pull requests](https://github.com/pappensex/YONI-app/pulls)
- Make sure your idea aligns with YONI's mission of creating a safe, loving space for mental health

### Making Changes

1. **Keep changes focused**: One feature or fix per pull request
2. **Test your changes**: Ensure everything works as expected
3. **Follow the existing code style**: Match the style of the files you're editing
4. **Update documentation**: If you're adding features, update relevant docs

### Project Structure

```
YONI-app/
├── api/              # API endpoints (Vercel serverless functions)
├── app/              # Application routes
├── core/             # Core modules and utilities
├── src/              # Source files
├── index.html        # Main entry point
├── contact.html      # Contact page
├── manifest.webmanifest  # PWA manifest
└── sw.js            # Service worker
```

## 🎨 Design Guidelines

YONI uses the **Überhochglitzer** (ultra-sparkle) design system:

| Token | Value | Meaning |
|-------|-------|---------|
| `brand.amethyst` | `#9966CC` | Hope, spirituality, transformation |
| `text.starwhite` | `#F5F5F5` | Clarity and light in darkness |
| `ok.emerald` | `#2ECC71` | Healing and growth |
| `hl.gold` | `#FFD700` | Warmth, value, and connection |

When making UI changes, please respect these colors and the cosmic, healing aesthetic.

## ✅ Pull Request Checklist

Before submitting your PR, make sure:

- [ ] Your code follows the project's style
- [ ] You've tested your changes locally
- [ ] Documentation is updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains what and why

## 🔍 CI Checks

All pull requests must pass these automated checks:

- ✅ **Build**: Project builds successfully
- ✅ **Linting**: Code meets style guidelines (if applicable)
- ✅ **Tests**: All tests pass (if applicable)

The CI workflow is defined in `.github/workflows/main.yml`.

## 🤝 Code of Conduct

YONI is a safe space. We expect all contributors to:

- Be respectful and empathetic
- Welcome diverse perspectives
- Focus on what's best for the community
- Show grace towards others

Remember: This project supports people dealing with mental health challenges. Please be mindful and compassionate in all interactions.

## 💡 Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**: Fix issues or unexpected behavior
- ✨ **Features**: Add new functionality
- 📝 **Documentation**: Improve or add documentation
- 🎨 **Design**: Enhance UI/UX
- ♿ **Accessibility**: Improve a11y (very important for YONI!)
- 🌍 **Translations**: Help make YONI available in more languages
- 🧪 **Tests**: Add or improve test coverage

## 🔧 Local Development

For detailed local development instructions, see [YONI_Local_Run_Guide.md](YONI_Local_Run_Guide.md).

### Quick Start for Static Site

The simplest way to test changes:

1. Open `index.html` directly in your browser
2. Or use a local server:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

### For Vercel Functions

To test API routes locally, you can use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## 📞 Getting Help

- **Questions?** Open a [discussion](https://github.com/pappensex/YONI-app/discussions)
- **Bug reports?** Create an [issue](https://github.com/pappensex/YONI-app/issues)
- **Need support?** Contact [yoni@pihoch2.me](mailto:yoni@pihoch2.me)

## 📜 License

By contributing to YONI, you agree that your contributions will be licensed under the MIT License.

---

> _"Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_
> 
> Thank you for helping make YONI shine brighter! ✨💜
