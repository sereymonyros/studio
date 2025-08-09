
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chasingexperiencesvlog.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'roadslesstraveled.us',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'twoaztrains.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'themaritimeexplorer.ca',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.allgrandcanyon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'travelnevada.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.traveloffpath.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
