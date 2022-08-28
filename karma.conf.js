/* eslint-disable import/no-extraneous-dependencies */
const commonjs = require('@rollup/plugin-commonjs');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const istanbul = require('rollup-plugin-istanbul');
const yargs = require('yargs');
const builds = require('./rollup.config');

module.exports = (karma) => {
  const args = yargs
    .option('verbose', { default: false })
    .argv;
  // Use the same rollup config as our dist files: when debugging (--watch),
  // we will prefer the unminified build which is easier to browse and works
  // better with source mapping. In other cases, pick the minified build to
  // make sure that the minification process (terser) doesn't break anything.
  const regex = args.watch ? /chartjs-gauge\.js$/ : /chartjs-gauge\.min\.js$/;
  const build = builds.filter(v => v.output.file.match(regex))[0];

  if (args.watch) {
    build.output.sourcemap = 'inline';
  }

  karma.set({
    frameworks: ['jasmine'],
    reporters: ['junit', 'spec'],
    browsers: ['chrome', 'firefox'],
    // browsers: ['chrome'],
    // browsers: ['chromeheadless'],
    logLevel: karma.LOG_WARN,

    // Explicitly disable hardware acceleration to make image
    // diff more stable when ran on Travis and dev machine.
    // https://github.com/chartjs/Chart.js/pull/5629
    customLaunchers: {
      chrome: {
        base: 'Chrome',
        flags: [
          '--disable-accelerated-2d-canvas',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
      },
      firefox: {
        base: 'Firefox',
        prefs: {
          'layers.acceleration.disabled': true,
        },
      },
      chromeheadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },

    files: [
      { pattern: 'node_modules/moment/min/moment.min.js', watched: false },
      { pattern: 'node_modules/moment-timezone/builds/moment-timezone-with-data.min.js', watched: false },
      { pattern: 'node_modules/chart.js/dist/chart.js', watched: false },
      { pattern: 'modules/chart.js/test/index.js', watched: false },
      'src/index.ts', // watch throws
    ].concat(args.inputs || ['test/specs/**/*.js']),

    preprocessors: {
      'modules/chart.js/test/index.js': ['rollup'],
      'src/index.ts': ['sources'],
    },

    rollupPreprocessor: {
      plugins: [
        resolve(),
        commonjs(),
      ],
      output: {
        name: 'test',
        format: 'umd',
      },
    },

    customPreprocessors: {
      sources: {
        base: 'rollup',
        options: build,
      },
    },

    // These settings deal with browser disconnects. We had seen test flakiness from Firefox
    // [Firefox 56.0.0 (Linux 0.0.0)]: Disconnected (1 times), because no message in 10000 ms.
    // https://github.com/jasmine/jasmine/issues/1327#issuecomment-332939551
    browserDisconnectTolerance: 3,

    junitReporter: {
      outputDir: 'test-result/junit/',
    },
  });

  // https://swizec.com/blog/how-to-run-javascript-tests-in-chrome-on-travis/swizec/6647
  if (process.env.TRAVIS) {
    karma.customLaunchers.chrome.flags.push('--no-sandbox');
  }

  if (args.coverage) {
    karma.reporters.push('coverage');
    karma.coverageReporter = {
      dir: 'test-result/coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
      ],
    };
    [
      karma.rollupPreprocessor,
      karma.customPreprocessors.sources.options,
    ].forEach(v => {
      (v.plugins || (v.plugins = [])).unshift(
        istanbul({
          include: 'src/**/*.js',
        }),
      );
    });
  }
};
