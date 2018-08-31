const { mv, rm, which, exec, mkdir, cp } = require('shelljs')
const colors = require('colors')
const path = require('path')
const { existsSync } = require('fs')

const rootPath = path.join(__dirname, '../')

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
  'package.json',
  'project.config.json',
  'wepy.config.js',
  'yarn.lock'
]

if (existsSync(`${rootPath}/template`)) {
  console.log(colors.cyan('删除本地template目录'))
  rm('-rf', `${rootPath}/template`)
}

mkdir('template')
templateFile.forEach(file => {
  console.log(colors.cyan(`拷贝文件 ${file} 至 template 目录`))
  cp('-R', file, `${rootPath}/template`)
})
