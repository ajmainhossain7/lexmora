/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        // Cloudinary CDN — all uploaded images are served from here
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // DiceBear — used for auto-generated user avatars
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard/add-lesson',
        destination: '/dashboard?tab=add',
        permanent: true,
      },
      {
        source: '/dashboard/my-lessons',
        destination: '/dashboard?tab=my',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
