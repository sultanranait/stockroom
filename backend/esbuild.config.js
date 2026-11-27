const { build } = require('esbuild');

const services = ['auth', 'product'];

// One bundle per service; @shared/* is resolved from tsconfig paths
build({
  entryPoints: services.map((name) => {
    return { in: `services/${name}/src/server.ts`, out: name };
  }),
  bundle: true,
  platform: 'node',
  target: 'node22',
  outdir: 'dist',
  packages: 'external',
  sourcemap: true,
  logLevel: 'info',
}).catch(() => {
  process.exit(1);
});
