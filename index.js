/*!
 * index.js
 * Created by Kilian Ciuffolo on Dec 28, 2015
 * (c) 2015 Kilian Ciuffolo
 */

'use strict'

const fs = require('fs')
const execSync = require('child_process').execSync
const resolve = require('path').resolve
const HOOK_SCRIPT_PATH = resolve(__dirname, 'hook.sh')

function findProjectRoot () {
  let stdout = execSync('git rev-parse --git-dir')
  return resolve(stdout.toString().replace('\n', ''), '..')
}

function ensureHooksDirExists (projectPath) {
  let hooksDir = resolve(projectPath, '.git/hooks')
  !doesPathExist(hooksDir) && fs.mkdirSync(hooksDir)
}

function saveHookRunner () {
  let tpl = fs.readFileSync(resolve(__dirname, 'hook.sh.tpl'), 'utf8')
  tpl = tpl.replace('{{PATH}}', process.env.PATH)
  fs.writeFileSync(resolve(__dirname, 'hook.sh'), tpl)
  fs.chmodSync(resolve(__dirname, 'hook.sh'), '744')
}

function installHook (hookName, projectPath) {
  var path = resolve(projectPath, '.git/hooks', hookName)

  if (isAlreadyInstalled(path)) {
    exports.log(` [ = ] ${hookName}`)
    return false
  }
  if (doesPathExist(path)) {
    exports.log(` [ ➜ ] ${hookName}.bak`)
    backup(path)
  }

  fs.symlinkSync(HOOK_SCRIPT_PATH, path)
  exports.log(` [ ✓ ] ${hookName}`)

  return true
}

function doesPathExist (path) {
  try {
    fs.statSync(path)
  } catch (err) {
    return false
  }

  return true
}

function isAlreadyInstalled (path) {
  return doesPathExist(path) &&
    fs.lstatSync(path).isSymbolicLink() &&
    fs.readlinkSync(path) === HOOK_SCRIPT_PATH
}

function backup (path) {
  fs.renameSync(path, path + '.bak')
}

function installHooks (hooks) {
  let projectPath = exports.findProjectRoot()
  exports.ensureHooksDirExists(projectPath)
  exports.saveHookRunner()
  hooks.forEach((hookName) => exports.installHook(hookName, projectPath))
}

exports.backup = backup
exports.ensureHooksDirExists = ensureHooksDirExists
exports.findProjectRoot = findProjectRoot
exports.installHook = installHook
exports.installHooks = installHooks
exports.isAlreadyInstalled = isAlreadyInstalled
exports.saveHookRunner = saveHookRunner
exports.HOOK_SCRIPT_PATH = HOOK_SCRIPT_PATH
exports.log = console.log.bind(console)

if (!module.parent) {
  exports.log('Symlinking shared-git-hooks runner in .git/hooks\n')

  installHooks([
    'applypatch-msg',
    'commit-msg',
    'post-applypatch',
    'post-checkout',
    'post-commit',
    'post-merge',
    'post-receive',
    'post-rewrite',
    'post-update',
    'pre-applypatch',
    'pre-auto-gc',
    'pre-commit',
    'pre-push',
    'pre-rebase',
    'pre-receive',
    'prepare-commit-msg',
    'update'
  ])

  exports.log()
  exports.log(`> Please add your scripts in ${exports.findProjectRoot()}/hooks or $GIT_HOOKS_PATH\n`)
}
