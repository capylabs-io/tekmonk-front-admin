/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'http',
              hostname: 'localhost',
              port: '1337',
              pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'tekdojo-be.s3.ap-southeast-1.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'tekdojo.s3.us-east-1.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'tekdojo-be-uat.s3.ap-southeast-1.amazonaws.com',
                pathname: '/**',
                
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
                pathname: '/**',
            }
        ],
    },
}

module.exports = nextConfig
