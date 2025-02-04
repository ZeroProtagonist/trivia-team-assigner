import { NextConfig } from 'next'

// The configuration object with proper TypeScript types
const config: NextConfig = {
  // ESLint configuration that tells Next.js to continue building even with warnings
  eslint: {
    // While ESLint will still run and show issues, it won't block the build process
    ignoreDuringBuilds: true,
  },
  // Keeps React's strict mode enabled for better development practices
  reactStrictMode: true,
}

// TypeScript requires this specific export syntax for module configurations
export default config
