# 1Cliq Trading Platform

A modern, responsive web application for trading with Google OAuth authentication, built with Vue.js 3, Vuetify, and Vite.

## 🚀 Features

- **Modern Authentication**: Google OAuth 2.0 integration
- **Responsive Design**: Mobile-first approach with Vuetify
- **Trading Dashboard**: Real-time market data and order execution
- **Order Management**: Comprehensive order tracking and management
- **User Settings**: Profile management and trading preferences
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions
- **Cross-Platform**: Works on all devices and browsers

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Vuetify 3, Pinia (State Management)
- **Build Tool**: Vite
- **Authentication**: Google OAuth 2.0
- **Deployment**: Netlify with GitHub Actions CI/CD
- **Testing**: Vitest
- **Linting**: ESLint

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Google Cloud Console account for OAuth setup
- GitHub account for repository and CI/CD

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/1cliqtrade.com.git
cd 1cliqtrade.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# API Configuration
VITE_API_BASE_URL=https://api.1cliqtrade.com
VITE_REDIRECT_URI=https://1cliqtrade.com/auth/callback
```

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🌐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`, `https://1cliqtrade.com`
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`, `https://1cliqtrade.com/auth/callback`
5. Copy Client ID and Client Secret to your `.env` file

## 🚀 Deployment

### Netlify Deployment

1. **Connect to GitHub**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add the same variables from your `.env` file

4. **Deploy**:
   - Netlify will automatically deploy on push to main branch
   - Visit your site URL to verify deployment

### GitHub Actions CI/CD

The repository includes a complete CI/CD pipeline that:

- Runs tests on every push and pull request
- Builds the application for production
- Deploys to Netlify automatically
- Supports multiple Node.js versions

#### Required GitHub Secrets:

Add these secrets in your GitHub repository settings:

- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `VITE_API_BASE_URL` - Your API base URL
- `VITE_REDIRECT_URI` - Your OAuth redirect URI
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID` - Your Netlify site ID

## 📁 Project Structure

```
1cliqtrade.com/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable Vue components
│   ├── pages/             # Page components
│   ├── router/            # Vue Router configuration
│   ├── services/          # API services and utilities
│   ├── stores/            # Pinia state management
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── .github/workflows/     # GitHub Actions
├── config/                # Configuration files
└── tests/                 # Test files
```

## 🔒 Security Features

- Content Security Policy (CSP) headers
- XSS protection
- Secure OAuth implementation
- Environment variable protection
- HTTPS enforcement in production

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Cross-Browser Testing

The application is tested on:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Customization

### Theme Colors

Edit the Vuetify theme in `src/main.js`:

```javascript
theme: {
  themes: {
    light: {
      colors: {
        primary: '#C42B1E',    // Main brand color
        secondary: '#424242',   // Secondary color
        accent: '#82B1FF',      // Accent color
        error: '#FF5252',       // Error color
        info: '#2196F3',        // Info color
        success: '#4CAF50',     // Success color
        warning: '#FFC107'      // Warning color
      }
    }
  }
}
```

### Adding New Pages

1. Create a new Vue component in `src/pages/`
2. Add route in `src/router/index.js`
3. Add navigation link in the main layout

## 🐛 Troubleshooting

### Common Issues

1. **Google OAuth not working**:
   - Check Client ID and redirect URI configuration
   - Ensure authorized domains are correctly set
   - Verify HTTPS in production

2. **Build fails**:
   - Check Node.js version (requires 18.x+)
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for ESLint errors: `npm run lint`

3. **Netlify deployment fails**:
   - Verify environment variables are set correctly
   - Check build logs in Netlify dashboard
   - Ensure all secrets are configured in GitHub

### Getting Help

- Check the [Issues](https://github.com/yourusername/1cliqtrade.com/issues) page
- Create a new issue with detailed description
- Include browser version, OS, and error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vuetify team for the beautiful UI components
- Google for OAuth authentication
- Netlify for hosting and CI/CD

## 📞 Support

For support, email support@1cliqtrade.com or join our Slack channel.