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
export declare function indented(...args: [TemplateStringsArray, ...unknown[]]): string;
