/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
