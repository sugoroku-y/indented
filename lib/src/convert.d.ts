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
export declare function convert(raw: readonly string[]): readonly string[];
