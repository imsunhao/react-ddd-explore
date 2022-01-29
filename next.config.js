/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, context) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SERVER__: isServer,
        __DEV__: dev,
      })
    )
    return config
  },
}

module.exports = nextConfig
