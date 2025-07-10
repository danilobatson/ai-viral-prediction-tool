/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		esmExternals: true,
	},
	webpack: (config, { isServer }) => {
		// Handle ES modules properly
		config.experiments = {
			...config.experiments,
			topLevelAwait: true,
		};

		return config;
	},
	env: {
		LUNARCRUSH_API_KEY: process.env.LUNARCRUSH_API_KEY,
		GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	},
};

export default nextConfig;
