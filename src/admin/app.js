/**
 * Customize admin panel theme and branding
 * Strapi 5 admin panel configuration
 */
const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
  theme: {
    // Customize admin panel theme
    light: {
      colors: {
        primary100: '#e8f4f8',
        primary200: '#b3d9e8',
        primary500: '#007bff',
        primary600: '#0066cc',
        primary700: '#0052a3',
        danger700: '#b72b1a',
        neutral0: '#ffffff',
        neutral800: '#32324d',
        neutral900: '#212134',
      },
    },
    dark: {
      colors: {
        primary100: '#1a1a2e',
        primary200: '#16213e',
        primary500: '#007bff',
        primary600: '#0066cc',
        primary700: '#0052a3',
        danger700: '#b72b1a',
        neutral0: '#212134',
        neutral800: '#a5a5ba',
        neutral900: '#ffffff',
      },
    },
  },
  menu: {
    logo: {
      // Custom logo - replace with your association logo
      // This would be a URL or path to your logo image
    },
  },
  auth: {
    logo: {
      // Custom logo for login page
    },
    title: 'Table Tennis Association',
    welcome: 'Welcome to Table Tennis Association Admin',
  },
  head: {
    favicon: '/favicon.png',
    title: 'Table Tennis Association - Admin',
  },
  tutorials: false, // Disable tutorials
  notifications: {
    releases: false, // Disable release notifications
  },
};

/**
 * Bootstrap admin panel with customizations
 */
const bootstrap = (app) => {
  // Add custom admin dashboard statistics
  // Register custom admin plugins, views, etc.
  console.log('Table Tennis Association Admin Panel initialized');
};

export default {
  config,
  bootstrap,
};

