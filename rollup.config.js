import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';

const isDevelopment = (
  process.env.ROLLUP_WATCH === 'true'
  || process.env.NODE_ENV === 'development'
);

const input = './src/index.ts';

const plugins = [
  typescript({
    check: isDevelopment,
    typescript: require('typescript'),
    tsconfig: (isDevelopment) ? 'tsconfig.json' : 'tsconfig.prod.json', // Only output sourcemaps on development
  }),
  nodeResolve({
    preferBuiltins: true,
  }),
  commonjs({
    include: /node_modules/,
    sourceMap: isDevelopment, // Only output sourcemaps on development
  }),
  json(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      isDevelopment ? 'development' : 'production'
    ),
  }),
];

if (!isDevelopment) {
  // terser is slow, only run when building
  plugins.push(terser());
}

const config = {
  input,
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: isDevelopment, // Only output sourcemaps on development
  },
  plugins,
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

if (isDevelopment) {
  config.watch = {
    chokidar: {
      paths: 'src/**',
      useFsEvents: false,
    }
  };
}

export default config;
