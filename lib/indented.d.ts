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
export declare function indented({ raw }: TemplateStringsArray, ...values: unknown[]): string;
