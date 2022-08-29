const typescript = require('@rollup/plugin-typescript');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const { default: dts } = require('rollup-plugin-dts');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');

const input = 'src/index.ts';
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.name} Contributors
 * Released under the MIT License
 */`;

const commonPlugins = [
  json(),
  typescript(),
  resolve({
    mainFields: ['module', 'main'],
    extensions: ['.mjs', '.cjs', '.js', '.jsx', '.json', '.node'],
    modulesOnly: true,
  }),
];

const minifyPlugins = [
  ...commonPlugins,
  terser({
    output: {
      preamble: banner,
    },
  }),
];

const dtsPlugins = [
  dts(),
];

module.exports = [
  { format: 'umd', ext: '.js', minify: false },
  { format: 'umd', ext: '.min.js', minify: true },
  { format: 'cjs', ext: '.cjs.js' },
  { format: 'esm', ext: '.esm.js' },
  { format: 'es', ext: '.d.ts' },
].map(({
  format, ext, minify = false,
}) => ({
  input,
  // eslint-disable-next-line no-nested-ternary
  plugins: ext === '.d.ts' ? dtsPlugins : (minify ? minifyPlugins : commonPlugins),
  output: {
    name: 'ChartGauge',
    format,
    file: `dist/index${ext}`,
    banner: minify ? false : banner,
    indent: false,
    globals: {
      'chart.js': 'Chart',
      'chart.js/helpers': 'Chart.helpers',
    },
  },
  external: [
    'chart.js',
    'chart.js/helpers',
  ],
}));
