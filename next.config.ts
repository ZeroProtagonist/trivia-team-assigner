import { NextConfig } from 'next'

const config: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'app', 'utils', 'lib', 'src']
  },
  reactStrictMode: true,
}

export default config