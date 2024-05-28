/**
 * インデント付きのテンプレートリテラルからインデントを除去した文字列を生成します。
 * @param args タグ付きテンプレートリテラルに指定されたテンプレートとパラメーター
 * @returns 生成した文字列を返します。
 *
 * 不正なエスケープシーケンスは`\`を除去するだけでエラーや例外にはなりません。
 * ※ただしconsole.errorで出力します
 */
export declare function indented(...args: [TemplateStringsArray, ...unknown[]]): string;
