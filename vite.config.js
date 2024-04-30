import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load environment variables based on the mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Define the environment variable in a way that's accessible within your code
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
    },
    
    // Plugins for Vite
    plugins: [react()],
    
    // Alias for imports
    resolve: {
      alias: [
        { find: '@', replacement: '/src' },
      ],
    },
  };
});
