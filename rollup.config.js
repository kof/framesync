import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

const typescriptConfig = { cacheRoot: 'tmp/.rpt2_cache' };
const noDeclarationConfig = Object.assign({}, typescriptConfig, {
  tsconfigOverride: { compilerOptions: { declaration: false } }
});

const config = {
  input: 'src/index.ts'
};

const umd = Object.assign({}, config, {
  output: {
    file: 'dist/framesync.js',
    format: 'umd',
    name: 'framesync',
    exports: 'named'
  },
  plugins: [typescript(noDeclarationConfig)]
});

const umdProd = Object.assign({}, umd, {
  output: Object.assign({}, umd.output, {
    file: 'dist/framesync.min.js'
  }),
  plugins: [typescript(noDeclarationConfig), uglify()]
});

const es = Object.assign({}, config, {
  output: {
    file: 'dist/framesync.es.js',
    format: 'es'
  },
  plugins: [typescript(noDeclarationConfig)]
});

const cjs = Object.assign({}, config, {
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [typescript(typescriptConfig)]
});

export default [umd, umdProd, es, cjs];
