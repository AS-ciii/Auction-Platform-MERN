/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        os: false,
        path: false,
        timers: false,
        stream: false,
        crypto: false,
        buffer: false,
        util: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        url: false,
        querystring: false,
        string_decoder: false,
        events: false,
        punycode: false,
        constants: false,
        process: false,
        module: false,
        vm: false,
        domain: false,
        console: false,
        debug: false,
        inspector: false,
        perf_hooks: false,
        readline: false,
        repl: false,
        v8: false,
        worker_threads: false,
        worker: false,
        cluster: false,
        dgram: false,
        'timers/promises': false,
      }
    }
    return config
  },
}

export default nextConfig
