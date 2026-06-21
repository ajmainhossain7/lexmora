/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard/add-lesson',
        destination: '/dashboard/user?tab=add',
        permanent: true,
      },
      {
        source: '/dashboard/my-lessons',
        destination: '/dashboard/user?tab=my',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
