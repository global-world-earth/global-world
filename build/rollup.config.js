import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser';
import requireContext from 'rollup-plugin-require-context';
import swc from 'rollup-plugin-swc';

const isProd = process.env.NODE_ENV === 'production';

// rollup默认只支持 export import 以及其他 es5 语法（function），因此，需要引入至少commonjs babel,来协助解决我们打包过程中的语法错误
// commonjs，解析编码中 自己写的 或者 第三方引入的 module.exports等语法
// babel 解析编码中，诸如：()=>{} 箭头函数，map等 es6语法。
const basePlugins = [
    json(),
    swc({
        jsc: {
            parser: {
                syntax: 'typescript', // mangle时，typescript依然能处理.js
                tsx: false,
                decorators: false,
                dynamicImport: false,
            },
            target: 'es5',
        },
    }),
    // commonjs 转 es6模块
    // rollup默认是不支持CommonJS模块的，自己写的时候可以尽量避免使用CommonJS模块的语法，但有些外部库的是cjs或者umd（由webpack打包的），所以使用这些外部库就需要支持CommonJS模块
    commonjs({
        ignore: ['conditional-runtime-dependency'],
    }),
    // 转换es6语法。把自己写的方法，箭头函数啥的转为function
    babel({
        exclude: 'node_modules/**',
    }),
    // eslint检查
    eslint({
        throwOnError: true,
        throwOnWarning: true,
        include: ['src/**'],
        exclude: ['node_modules/**'],
    }),
    // 支持 require.context 语法 需配合 ignore: ["conditional-runtime-dependency"] 实现
    requireContext(),
    resolve({
        extensions: ['.ts'],
        exclude: '**/node_modules/**', // 排除node_modules
    }),
    // postcss()
];

const devPlugins = [];
const prodPlugins = [
    // 压缩文件
    terser(),
];

let plugins = [...basePlugins].concat(isProd ? prodPlugins : devPlugins);

export default [
    {
        input: './src/Viewer.js',
        output: [
            {
                file: './dist/nerf-umd.js',
                format: 'umd',
                name: 'CMap',
                //当入口文件有export时，'umd'格式必须指定name
                //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
            },
            {
                file: './dist/nerf-es.js',
                format: 'es',
            },
            {
                file: './dist/nerf-cjs.js',
                format: 'cjs',
            },
        ],
        plugins,
    },
    {
        input: './src/Script.js',
        output: [
            {
                file: './dist/nerf-script-cjs.js',
                format: 'cjs',
            },
        ],
        plugins,
    },
];
