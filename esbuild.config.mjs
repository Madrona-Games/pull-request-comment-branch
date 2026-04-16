import { build } from 'esbuild';
import esbuildPluginLicense from 'esbuild-plugin-license';

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  target: 'node24',
  outdir: 'dist',
  outExtension: { '.js': '.js' },
  entryNames: 'index',
  format: 'cjs',
  plugins: [
    esbuildPluginLicense({
      thirdParty: {
        output: {
          file: 'licenses.txt',
          template(dependencies) {
            return dependencies
              .map(
                (dep) =>
                  `${dep.packageJson.name}@${dep.packageJson.version}\n${dep.packageJson.license}\n${dep.licenseText || ''}`,
              )
              .join('\n\n---\n\n');
          },
        },
      },
    }),
  ],
});
