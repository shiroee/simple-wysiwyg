/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Configure basePath for GitHub Pages
    // Replace 'your-repo-name' with your actual repository name
    basePath: process.env.NODE_ENV === 'development' ? '' : '/simple-wysiwyg',
    // Disable image optimization since it's not supported with static exports
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
