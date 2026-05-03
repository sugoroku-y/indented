import { unescape } from './unescape';

const NEWLINE = `(?:\r\n|[\r\n\u2028\u2029])`;
const WHITESPACES = `([ \t]*)`;
const TRAILING_WHITESPACE_REGEX = new RegExp(`${NEWLINE}${WHITESPACES}$`);
const LEADING_WHITESPACE_REGEX = new RegExp(`^${NEWLINE}${WHITESPACES}`);
const UNINDENT_REGEX = new RegExp(`(${NEWLINE})${WHITESPACES}`, 'g');
const TRAILING_NEWLINE_REGEX = new RegExp(`${NEWLINE}$`);
const LEADING_NEWLINE_REGEX = new RegExp(`^${NEWLINE}`);

/**
 * template literalの各行からインデントを取り除く
 *
 * - 先頭・末尾の改行は取り除く
 * - 各行の行頭からインデントを取り除く
 *   - インデントは末尾の改行から終端までの空白とタブの連続とする
 *   - インデントにマッチしない行頭の空白は取り除かない
 * - エスケープシーケンスを解釈する
 *   - ただし不正なエスケープシーケンスは`\`を除去するだけでエラーや例外にはしない
 *
 * 末尾の改行から終端までに空白とタブがない場合はインデント除去は行わず、エスケープシーケンスの解釈のみを行う
 * @param raw template literalのraw部分
 * @returns 変換後のtemplate literalのraw部分
 */
export function convert(raw: readonly string[]): readonly string[] {
    // 最後の改行から終端までが空白とタブだけであればその空白とタブの連続をインデントと見なす
    const indent = TRAILING_WHITESPACE_REGEX.exec(raw[raw.length - 1])?.[1];
    if (
        !indent ||
        !LEADING_WHITESPACE_REGEX.exec(raw[0])?.[1].startsWith(indent)
    ) {
        // インデントがない、もしくは先頭が終端と同じ改行とインデントで始まっていない場合はエスケープ解除のみ
        return raw.map(unescape);
    }
    return raw.map((s, i) =>
        unescape(trimNewLine(unindent(s, indent), i, raw.length)),
    );
}

/**
 * インデントを取り除く。
 * @param s 対象の文字列
 * @param indent インデント
 * @returns インデントを取り除いた文字列
 */
function unindent(s: string, indent: string): string {
    return s.replace(
        UNINDENT_REGEX,
        (match, newline: string, whitespace: string) =>
            whitespace.startsWith(indent)
                ? // 改行とインデントで始まっていればインデント分の空白を取り除く
                  `${newline}${whitespace.slice(indent.length)}`
                : // でなければそのまま
                  match,
    );
}

/**
 * 先頭、末尾の改行を取り除く
 * @param t 対象の文字列
 * @param i 配列内でのインデックス
 * @param length 配列の要素数
 * @returns 改行を取り除いた文字列
 */
function trimNewLine(t: string, i: number, length: number): string {
    // 引数を変更しないようにコピーを作成
    let s = t;
    if (i === 0) {
        // 先頭の改行を除去
        s = s.replace(LEADING_NEWLINE_REGEX, '');
    }
    // 先頭かつ終端である場合は両方の改行を取り除く必要があるのでelseではなく独立したifとする
    if (i === length - 1) {
        // 終端の改行を除去
        s = s.replace(TRAILING_NEWLINE_REGEX, '');
    }
    return s;
}
