const { readFile, writeFile } = require('fs')
const { resolve } = require('path')
const { build } = require('vite')
const dts = require('vite-plugin-dts')
const pkg = require(resolve(`package.json`))

main()

async function main() {
  await startBuild()
  await addMainPackageJson()
  await addReadMe()
}

async function startBuild(target) {
  await build({
    plugins: [
      dts({
        outDir: resolve(__dirname, target ? `../dist/` : '../dist/types/'),
      }),
    ],
    build: {
      lib: {
        entry: resolve(
          __dirname,
          target ? `../src/${target}/index.ts` : '../src/index.ts',
        ),
        name: 'index',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        output: [
          {
            format: 'umd',
            name: 'index',
            assetFileNames: 'index.[ext]',
          },
          {
            format: 'esm',
            name: 'index',
            assetFileNames: 'index.[ext]',
          },
        ],
      },
      outDir: resolve(__dirname, target ? `../dist/${target}/` : '../dist/'),
    },
  })
}

async function addMainPackageJson() {
  const dir = resolve(__dirname, '../dist')
  const fileName = resolve(dir, 'package.json')

  const data = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: pkg.main,
    module: pkg.module,
    types: pkg.types,
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
    repository: pkg.repository,
    homepage: pkg.homepage,
  }

  return new Promise((resolve, reject) => {
    writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function addReadMe() {
  const dir = resolve(__dirname, '../dist')
  const fileName = resolve(dir, 'README.md')

  return new Promise((ok, reject) => {
    readFile(resolve('README.md'), (err, data) => {
      if (err) {
        reject(err)
        return
      }
      writeFile(fileName, data, (err) => {
        if (err) reject(err)
        else ok()
      })
    })
  })
}
