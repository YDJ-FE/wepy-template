const { rm, mkdir, cp } = require('shelljs')
const colors = require('colors')
const path = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')

const rootPath = path.join(__dirname, '../')
const templatePath = `${rootPath}/template`
const pkgPath = `${rootPath}/package.json`
const templatePkgPath = `${templatePath}/package.json`

const DelField = (ref, field, prop) => {
  delete ref[field][prop]
  console.log(colors.green(`${field} 字段 ${prop} 属性已删除`))
}

const templateFile = [
  'src',
  '.editorconfig',
  '.eslintignore',
  '.eslintrc.js',
  '.gitignore',
  '.npmrc',
  '.prettierignore',
  '.prettierrc',
  '.wepyignore',
  'project.config.json',
  'wepy.config.js',
  'yarn.lock'
]

if (existsSync(templatePath)) {
  console.log(colors.cyan('删除本地template目录'))
  rm('-rf', templatePath)
}

mkdir('template')
templateFile.forEach(file => {
  console.log(colors.cyan(`拷贝文件 ${file} 至 template 目录`))
  cp('-R', file, templatePath)
})

const pkg = JSON.parse(readFileSync(pkgPath))

DelField(pkg, 'scripts', 'dev:tools')
DelField(pkg, 'scripts', 'build:template')
DelField(pkg, 'devDependencies', 'colors')
DelField(pkg, 'devDependencies', 'nodemon')
DelField(pkg, 'devDependencies', 'shelljs')

writeFileSync(templatePkgPath, JSON.stringify(pkg, null, 2))
