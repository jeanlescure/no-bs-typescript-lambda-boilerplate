import { RollupOptions } from 'rollup';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

const isProduction = (process.env.NODE_ENV === 'production');

const input = './src/index.ts';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : (process.env.NODE_ENV || 'development')
    ),
  }),
  typescript({
    check: !isProduction,
    typescript: require('typescript'),
    tsconfig: (isProduction) ? 'tsconfig.prod.json' : 'tsconfig.json', // Only output sourcemaps on development
  }),
  nodeResolve({
    preferBuiltins: true,
  }),
  commonjs({
    include: /node_modules/,
    sourceMap: !isProduction, // Only output sourcemaps on development
  }),
  json(),
];

if (isProduction) {
  // terser is slow, only run when building
  plugins.push(terser());
}

const config: RollupOptions = {
  input,
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: !isProduction, // Only output sourcemaps on development
  },
  plugins,
  // skip these commonly used node.js internal modules to avoid
  // warning "(!) Unresolved dependencies"
  external: [
    'util',
    'stream',
    'http',
    'url',
    'zlib',
    'https',
    'buffer',
    'string_decoder',
  ],
};

if (!isProduction) {
  config.watch = {
    chokidar: {
      useFsEvents: false,
    },
    include: 'src/**',
    clearScreen: false,
  };
}

export default config;
