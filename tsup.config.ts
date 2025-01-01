import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/pack.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: 'lib',
  minify: false,
  target: 'node20',
  format: 'cjs',
  external: ['./ignore'],
});
