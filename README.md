# `shared-git-hooks`

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](https://github.com/feross/standard)
[![build status](https://img.shields.io/travis/kilianc/shared-git-hooks.svg?style=flat-square)](https://travis-ci.org/kilianc/shared-git-hooks)
[![coverage](https://img.shields.io/codeclimate/coverage/github/kilianc/shared-git-hooks.svg?style=flat-square)](https://codeclimate.com/github/kilianc/shared-git-hooks/coverage)
[![npm version](https://img.shields.io/npm/v/shared-git-hooks.svg?style=flat-square)](https://www.npmjs.com/package/shared-git-hooks)
[![npm downloads](https://img.shields.io/npm/dm/shared-git-hooks.svg?style=flat-square)](https://www.npmjs.com/package/shared-git-hooks)
[![License](https://img.shields.io/npm/l/shared-git-hooks.svg?style=flat-square)](https://www.npmjs.com/package/shared-git-hooks)

## Install

    $ npm i shared-git-hooks --save-dev

## Usage

Add your scripts to `./hooks` and name them 1:1 as git hooks:

    applypatch-msg
    pre-applypatch
    post-applypatch
    pre-commit
    prepare-commit-msg
    commit-msg
    post-commit
    pre-rebase
    post-checkout
    post-merge
    pre-push
    pre-receive
    update
    post-receive
    post-update
    pre-auto-gc
    post-rewrite

A generic script symlinked in `.git/hooks` after `npm install`ing your project, will look for a script with a matching name in `./hooks` and run it.

You can also set a `$GIT_HOOKS_PATH` env var and customize your scripts location.

## Assumption

This project assumes that:

* you have a `package.json`, `.git/` and `hooks/` in the root of your project.
* you want to run your hooks with the same env `$PATH` you have when you run `npm install` *(this will allow git GUI like Tower to access node through `nvm` for example)*

## Example

Save the following as `./hooks/pre-commit`

```bash
#!/usr/bin/env node
console.log('refusing all commits!')
process.exit(1)
```

## Related projects

  * Original [git-hooks](https://github.com/icefox/git-hooks) project
  * [pre-commit](https://github.com/observing/pre-commit)
  * [ghooks](https://github.com/gtramontina/ghooks)
  * [git-hooks-js](https://github.com/tarmolov/git-hooks-js)
  * [husky](https://github.com/typicode/husky)

## How to contribute

This project follows the awesome [Vincent Driessen](http://nvie.com/about/) [branching model](http://nvie.com/posts/a-successful-git-branching-model/).

* You must add a new feature on its own branch
* You must contribute to hot-fixing, directly into the master branch (and pull-request to it)

This project uses [standardjs](https://github.com/feross/standard) to enforce a consistent code style. Your contribution must be pass standard validation.

The test suite is written on top of [mochajs/mocha](http://mochajs.org/). Use the tests to check if your contribution breaks some part of the library and be sure to add new tests for each new feature.

    $ npm test

## License

_This software is released under the MIT license cited below_.

    Copyright (c) 2015 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the 'Software'), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
