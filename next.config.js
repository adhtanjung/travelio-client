/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "books.google.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.adhtanjung.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
