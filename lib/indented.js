"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indented = void 0;
const unescape_1 = require("./unescape");
class Cache {
    constructor() {
        this.cache = new WeakMap();
    }
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
        var _a, _b;
        // 最後の改行から終端までが空白とタブだけであればその空白とタブの連続をインデントと見なす
        const indent = (_a = /(?:\r\n|[\r\n\u2028\u2029])([ \t]+)$/.exec(raw[raw.length - 1])) === null || _a === void 0 ? void 0 : _a[1];
        return raw.map(indent &&
            ((_b = /^(?:\r\n|[\r\n\u2028\u2029])([ \t]+)/
                .exec(raw[0])) === null || _b === void 0 ? void 0 : _b[1].startsWith(indent))
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
 * インデント付きのテンプレートリテラルからインデントを除去した文字列を生成します。
 * @param _ タグ付きテンプレートリテラルに指定されたテンプレート
 * @param _.raw エスケープシーケンスを解除する前のテンプレート
 * @param values タグ付きテンプレートリテラルに指定されたパラメーター
 * @returns 生成した文字列を返します。
 *
 * 不正なエスケープシーケンスは`\`を除去するだけでエラーや例外にはなりません。
 * ※ただしconsole.errorで出力します
 */
function indented({ raw }, ...values) {
    return templateCache
        .get(raw)
        .reduce((r, e, i) => `${r}${String(values[i - 1])}${e}`);
}
exports.indented = indented;
//# sourceMappingURL=indented.js.map