# @sugoroku-y/indented

[![TypeScript](https://img.shields.io/badge/-TypeScript-404040.svg?logo=TypeScript)](https://www.typescriptlang.org/)
[![GitHub Packages](https://img.shields.io/badge/-GitHub%20Packages-181717.svg?logo=github&style=flat)](https://github.com/sugoroku-y/indented/pkgs/npm/indented)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](./LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/sugoroku-y/indented/badge.svg)](https://coveralls.io/github/sugoroku-y/indented)
[![Publish package to GitHub Packages](https://github.com/sugoroku-y/indented/actions/workflows/publish.yml/badge.svg)](https://github.com/sugoroku-y/indented/actions/workflows/publish.yml)
[![Push Coverage to Coveralls](https://github.com/sugoroku-y/indented/actions/workflows/coverage.yml/badge.svg)](https://github.com/sugoroku-y/indented/actions/workflows/coverage.yml)

Tagged templates that can be written indented.

インデント付きで記述できるタグ付きテンプレート。

- 末尾が改行+空白orタブで終わっている。
  - この時の空白orタブの並びをインデントとします。
- 先頭が改行+インデントで始まっている。

上記の条件に合うとき、テンプレートリテラルの各行の行頭からインデントをとり除いてから、テンプレートリテラルとして文字列を生成する、タグ付きテンプレートです。

```ts
const s = indented`
    abc
    def
    ghi
    `;
// -> s = "abc\ndef\nghi"
```

ただし、条件が合わないときには通常のテンプレートリテラルとほぼ同じ文字列生成になります。

```ts
// 末尾が改行+空白orタブで終わっていない
const e1 = indented`
    abc
    def
    ghi    `;
// -> e1 = "    abc\n    def\n    ghi    "

// 先頭が改行で始まっていない
const e2 = indented`    abc
    def
    ghi
     `;
// -> e2 = "    abc\n    def\n    ghi\n     "

// 先頭のインデントが足りない
const e3 = indented`
    abc
    def
    ghi
     `;
// -> e3 = "\n    abc\n    def\n    ghi\n     "
```

## インストール

以下のコマンドを実行してください。

```bash
npm install sugoroku-y/indented
```

## API

```ts
function indented(...args: [TemplateStringsArray, ...unknown[]]): string;
```

インデント付きのテンプレートリテラルからインデントを除去した文字列を生成します。

- パラメーター
  - `...args` タグ付きテンプレートリテラルに指定されたテンプレートとパラメーター
- 返値

  生成した文字列を返します。

  不正なエスケープシーケンスは`\`を除去するだけでエラーや例外にはなりません。

  ※ただし`console.error`で出力します。

## License(使用許諾)

Copyright YEBISUYA Sugoroku 2024. Licensed MIT.
