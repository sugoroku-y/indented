"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indented = indented;
const unescape_1 = require("./unescape");
class Cache {
    cache = new WeakMap();
    get(key) {
        if (this.cache.has(key)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- hasでチェックしているのでgetの返値はT
            return this.cache.get(key);
        }
        const value = this.newInstance(key);
        this.cache.set(key, value);
        return value;
    }
}
class TemplateCache extends Cache {
    newInstance(raw) {
        // 最後の改行から終端までが空白とタブだけであればその空白とタブの連続をインデントと見なす
        const indent = /(?:\r\n|[\r\n\u2028\u2029])([ \t]+)$/.exec(raw[raw.length - 1])?.[1];
        return raw.map(indent &&
            /^(?:\r\n|[\r\n\u2028\u2029])([ \t]+)/
                .exec(raw[0])?.[1]
                .startsWith(indent)
            ? // 先頭が終端と同じく改行とインデントで始まっていればインデント除去とエスケープ解除
                (s, i) => (0, unescape_1.unescape)(TemplateCache.trimNewLine(TemplateCache.unindent(s, indent), i, raw.length))
            : // でなければエスケープ解除のみ
                unescape_1.unescape);
    }
    static unindent(s, indent) {
        return s.replace(/(\r\n|[\r\n\u2028\u2029])([ \t]*)/g, (match, newline, whitespace) => whitespace.startsWith(indent)
            ? `${newline}${whitespace.slice(indent.length)}`
            : match);
    }
    static trimNewLine(t, i, length) {
        let s = t;
        if (i === 0) {
            // 先頭の改行を除去
            s = s.replace(/^(?:\r\n|[\r\n\u2028\u2029])/, '');
        }
        if (i === length - 1) {
            // 終端の改行を除去
            s = s.replace(/(?:\r\n|[\r\n\u2028\u2029])$/, '');
        }
        return s;
    }
}
const templateCache = new TemplateCache();
/**
 * - 末尾が改行+空白orタブで終わっている。
 *   - この時の空白orタブの並びをインデントとします。
 * - 先頭が改行+インデントで始まっている。
 *
 * 上記の条件に合うとき、テンプレートリテラルの各行の行頭からインデントをとり除いてから、テンプレートリテラルとして文字列を生成する、タグ付きテンプレートです。
 *
 * ```ts
 * const s = indented`
 *      abc
 *      def
 *      `;
 * // -> s = 'abc\ndef';
 * ```
 * @param args タグ付きテンプレートリテラルに指定されたテンプレートとパラメーター
 * @returns 生成した文字列を返します。
 *
 * 不正なエスケープシーケンスは`\`を除去するだけでエラーや例外にはなりません。
 * ※ただしconsole.errorで出力します
 * @example
 * `\`の直後に改行があると改行がないものと見なされます。
 * ```ts
 * const s = indented`
 *      abc
 *      ${true}
 *      def\
 *      ${0}
 *       ghi
 *      `;
 * // -> s = 'abc\ntrue\ndef0\h ghi';
 * ```
 *
 * 取り除かれるインデントは改行の直後にあるインデントと一致する空白およびタブの並びになります。
 *
 * 改行の後にインデントより短い空白文字、インデントと異なる空白やタブの組合せがあると除去されませんので注意してください。
 *
 * ```ts
 * const s = indented`
 *      abc
 *     def
 *      `;
 * // -> s = 'abc\n    def';
 * ```
 */
function indented(...args) {
    return templateCache
        .get(args[0].raw)
        .reduce((r, e, i) => `${r}${args[i]}${e}`);
}
//# sourceMappingURL=indented.js.map