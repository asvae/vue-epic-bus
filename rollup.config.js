import babel from 'rollup-plugin-babel'
import packageJson from './package.json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

const extensions = ['.ts']

export default {
  input: './src/BusPlugin.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
    },
    {
      file: packageJson.module,
      format: 'esm',
    },
  ],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    // typescriptPlugin({ useTsconfigDeclarationDir: true }),
    babel({ extensions, include: ['src/**/*'] }),
  ],
}
