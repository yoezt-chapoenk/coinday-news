/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
    // Add unoptimized for external domains that might have issues
    unoptimized: false,
  },
}

// Dynamically add Supabase hostname if available
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    nextConfig.images.remotePatterns.push({
      protocol: 'https',
      hostname: supabaseUrl.hostname,
    });
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_SUPABASE_URL:', error);
  }
}

module.exports = nextConfig