# Craftland Hub Documentation

Welcome to the Craftland Hub documentation. This directory contains all technical documentation for the project.

## 📚 Documentation Index

### Core Documentation
- [Security Guidelines](../SECURITY.md) - Security best practices and API protection
- [Content Moderation](../CONTENT_MODERATION.md) - Content filtering and validation system
- [Category System](../CATEGORY_FIX_DOCUMENTATION.md) - Complete category mapping and API integration

### Utilities
- [Check Maps Script](../scripts/check-maps.js) - Database verification utility

## 🚀 Quick Start

1. **Configure Environment**: Copy `.env.example` to `.env.local` with your Firebase config
2. **Install Dependencies**: `npm install`
3. **Run Development**: `npm run dev`
4. **Build for Production**: `npm run build`

## 🔧 Common Tasks

### Check Database Contents
```bash
node scripts/check-maps.js
```

### Build with Size Analysis
```bash
npm run build
```

### Deploy
```bash
npm run build
# Deploy .next/standalone folder
```

## 📖 Key Features

- **Multi-language Support**: 6 languages (EN, PT, ES, HI, AR, BN)
- **Category System**: 8 categories with API integration
- **Map Submission**: With content moderation
- **Firebase Integration**: Auth, Firestore, Analytics
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Static generation where possible

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Analytics**: Google Analytics 4
- **Internationalization**: next-intl

## 📝 Contributing

When adding new features:
1. Update relevant documentation
2. Add tests if applicable
3. Follow existing code patterns
4. Update this index if adding new docs

## 🐛 Reporting Issues

If you encounter issues:
1. Run `node scripts/check-maps.js` to verify database
2. Check browser console for errors
3. Review Firebase logs
4. Check Firestore security rules

## 📞 Support

For questions or issues:
- Check documentation in this folder
- Review the main [README.md](../README.md)
- Check Firebase console for errors
