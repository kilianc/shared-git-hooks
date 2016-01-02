/*!
 * test.js
 * Created by Kilian Ciuffolo on Dec 28, 2015
 * (c) 2015 Kilian Ciuffolo
 */

'use strict'

const fs = require('fs')
const execSync = require('child_process').execSync
const assert = require('chai').assert
const sinon = require('sinon')
const mock = require('mock-fs')
const ghooks = require('./')

ghooks.log = () => {}

describe('shared-git-hooks', () => {
  let sandbox = sinon.sandbox.create()

  afterEach(() => {
    mock.restore()
    sandbox.restore()
  })

  describe('findProjectRoot()', () => {
    let cwd = process.cwd()
    execSync('rm -rf test-git-root')

    after(function () {
      process.chdir(cwd)
      execSync('rm -rf test-git-root')
    })

    it('should return the root path of the project', () => {
      fs.mkdirSync('test-git-root')
      fs.mkdirSync('test-git-root/foo')
      fs.mkdirSync('test-git-root/foo/bar')
      execSync('cd test-git-root && git init')
      process.chdir('test-git-root/foo/bar')
      assert.equal(execSync('pwd'), __dirname + '/test-git-root/foo/bar\n')
      assert.equal(ghooks.findProjectRoot(), __dirname + '/test-git-root')
    })
  })

  describe('ensureHooksDirExists()', () => {
    it('should create .git/hooks if not present', () => {
      mock({ '/project/.git': {} })
      assert.throws(() => fs.statSync('/project/.git/hooks'))
      ghooks.ensureHooksDirExists('/project/')
      assert.doesNotThrow(() => fs.statSync('/project/.git/hooks'))
    })
  })

  describe('saveHookRunner()', () => {
    it('should save hook.sh and freeze $PATH', () => {
      mock({
        [`${__dirname}/hook.sh.tpl`]: fs.readFileSync(__dirname + '/hook.sh.tpl')
      })
      ghooks.saveHookRunner()
      let runner = fs.readFileSync(__dirname + '/hook.sh').toString()
      assert.ok(runner.includes(`PATH=${process.env.PATH}`))
    })
  })

  describe('isAlreadyInstalled()', () => {
    it('should return true if already installed', () => {
      mock({
        [__dirname + '/hook.sh']: 'foo',
        '/foo/hook': mock.symlink({
          path: __dirname + '/hook.sh'
        })
      })
      assert.ok(ghooks.isAlreadyInstalled('/foo/hook'))
    })

    it('should return false if another script is present', () => {
      mock({ '/foo/hook': 'foo' })
      assert.notOk(ghooks.isAlreadyInstalled('/foo/hook'))
    })

    it('should return false hook is missing', () => {
      mock({})
      assert.notOk(ghooks.isAlreadyInstalled('/foo/not-exist'))
    })
  })

  describe('backup()', () => {
    it('should work', () => {
      mock({ 'path/to/something': 'foo' })
      ghooks.backup('path/to/something')
      assert.equal(fs.readFileSync('path/to/something.bak'), 'foo')
    })
  })

  describe('installHook()', () => {
    it('should install the hook', () => {
      mock({
        [__dirname + '/hook.sh']: 'foo',
        '/project/.git/hooks': {}
      })
      assert.ok(ghooks.installHook('test', '/project'))
      assert.doesNotThrow(() => fs.lstatSync('/project/.git/hooks/test'))
      assert.equal(fs.readlinkSync('/project/.git/hooks/test'), ghooks.HOOK_SCRIPT_PATH)
    })

    it('should skip if already installed', () => {
      mock({
        [__dirname + '/hook.sh']: 'foo',
        '/project/.git/hooks/test': mock.symlink({
          path: __dirname + '/hook.sh'
        })
      })
      assert.notOk(ghooks.installHook('test', '/project'))
      assert.doesNotThrow(() => fs.lstatSync('/project/.git/hooks/test'))
      assert.equal(fs.readlinkSync('/project/.git/hooks/test'), ghooks.HOOK_SCRIPT_PATH)
    })

    it('should backup old hooks', () => {
      mock({
        [__dirname + '/hook.sh']: 'foo',
        '/project/.git/hooks/test': 'foo'
      })
      assert.ok(ghooks.installHook('test', '/project'))
      assert.doesNotThrow(() => fs.lstatSync('/project/.git/hooks/test'))
      assert.equal(fs.readlinkSync('/project/.git/hooks/test'), ghooks.HOOK_SCRIPT_PATH)
      assert.equal(fs.readFileSync('/project/.git/hooks/test.bak'), 'foo')
    })
  })

  describe('installHooks()', () => {
    it('should work', () => {
      sandbox.stub(ghooks, 'ensureHooksDirExists')
      sandbox.stub(ghooks, 'installHook')

      ghooks.installHooks(['foo'])
      assert.ok(ghooks.ensureHooksDirExists.calledOnce, 'ensureHooksDirExists')
      assert.ok(ghooks.installHook.calledWith('foo', __dirname))
    })
  })
})

describe('JavaScript codebase', function () {
  it('conforms to javascript standard style (http://standardjs.com)', require('mocha-standard'))
})
