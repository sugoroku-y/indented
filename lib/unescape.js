"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unescape = unescape;
/**
 * エスケープ文字のうち、定数から定数への変換を行うもののマップ
 */
const UNESCAPE_MAP = {
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
    // 改行前に`\`があれば`\`ごと削除
    '\r': '',
    '\r\n': '',
    '\n': '',
    '\u2028': '', // Line Separator
    '\u2029': '', // Paragraph Separator
    // 8進数のエスケープ文字の中でも`\0`だけ(後ろに数字が続かないもの)は例外的に許可
    0: '\0',
    // `\`を除去するだけの変換
    "'": "'",
    '"': '"',
    '\\': '\\',
    // 末尾に単独の`\`があった場合もエラーにしない
    '': '',
};
/**
 * エスケープシーケンスを解除した文字列を返します。
 * @param s エスケープシーケンス付きの文字列
 * @returns エスケープシーケンスを解除した文字列
 */
function unescape(s) {
    return s.replace(/\\(?:x(?<hex2>[0-9A-F]{2})|u(?<hex4>[0-9A-F]{4})|u\{0*?(?<hexCodePoint>[0-9A-F]{1,4}|(?:[1-9A-F]|10)[0-9A-F]{4})\}|0\d|\r\n|[^]|$)/gi, 
    //    ^^^^^^^^^^^^^^^^^^^^^                                                                                                      16進エスケープシーケンス
    //                          ^^^^^^^^^^^^^^^^^^^^^                                                                                Unicodeエスケープシーケンス
    //                                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^              Unicodeコードポイントエスケープ
    //                                                                                                                  ^^^          後ろに数字が続くため8進エスケープシーケンス(不正)と見なされる`\0`: 正規な方はその他の文字で吸収する
    //                                                                                                                      ^^^^     2文字の組合せの改行: 1文字だけのものはその他の文字で吸収する
    //                                                                                                                           ^^^ その他の文字: 不正なエスケープシーケンスを含む
    (match, ...args) => {
        const [index, input, groups] = args.slice(-3);
        const ch = match.slice(1);
        const { hex2, hex4, hexCodePoint } = groups;
        return (
        // 16進文字コードのエスケープシーケンス
        convertHexCodePoint(hex2 ?? hex4 ?? hexCodePoint) ??
            // 特定の文字のエスケープシーケンス
            UNESCAPE_MAP[ch] ??
            (unsupportedEscapeSequence(index, input),
                // エラーにしないときは`\`だけ除去しておく
                ch));
    });
}
function unsupportedEscapeSequence(index, input) {
    const current = input.slice(index);
    // 不正なエスケープシーケンスのときなのでログを出す
    let match;
    console.error((match = /^(?:\\x[^]{0,2}|\\u\{([^]*)\}|\\u[^]{0,4})/.exec(current)) !=
        null
        ? parseInt(match[1], 16) >= 0x110000
            ? // Unicode範囲外
                `Parsing error: An extended Unicode escape value must be between 0x0 and 0x10FFFF inclusive.: '${match[0]}'`
            : // 16進表記のエラー
                `Parsing error: Hexadecimal digit expected.: '${match[0]}'`
        : (match = /^\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?)/.exec(current)) !=
            null
            ? // 8進表記は使用できない
                `Octal escape sequences are not allowed. Use the syntax '\\x${parseInt(match[0].slice(1), 8).toString(16).padStart(2, '0')}'`
            : (match = /^\\(?:[89])/.exec(current)) != null
                ? // \8や\9も使用できない
                    `Parsing error: Escape sequence '${match[0]}' is not allowed.`
                : // その他は不要なエスケープ
                    `Unnecessary escape character: '${[...current].slice(0, 2).join('')}'`);
}
/**
 * 16進コードポイントを文字に変換します。
 * @param hex 16進コードポイント
 * @returns `hex`を16進コードポイントとして変換した文字を返します。
 *
 * ただし、`hex`が空文字列もしくは`undefined`のときは`undefined`を返します。
 * @throws 以下の場合に例外(`RangeError`)を投げます
 * - `hex`が`'10ffff'`を超えている
 * - `hex`が16進文字以外を含んでいる
 */
function convertHexCodePoint(hex) {
    return hex ? String.fromCodePoint(parseInt(hex, 16)) : undefined;
}
//# sourceMappingURL=unescape.js.map