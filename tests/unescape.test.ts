import { unescape } from '../src/unescape';

describe('unescape', () => {
    test.each`
        escaped                               | expected
        ${String.raw`abc def`}                | ${'abc def'}
        ${String.raw`
abc
def
`} | ${'\nabc\ndef\n'}
        ${String.raw`\
abc\
def\
`} | ${'abcdef'}
        ${`\\\r`}                             | ${''}
        ${`\\\r\n`}                           | ${''}
        ${`\\\n`}                             | ${''}
        ${`\\\u2028`}                         | ${''}
        ${`\\\u2029`}                         | ${''}
        ${String.raw`\0`}                     | ${'\0'}
        ${String.raw`\0a`}                    | ${'\0a'}
        ${String.raw`\b`}                     | ${'\b'}
        ${String.raw`\f`}                     | ${'\f'}
        ${String.raw`\n`}                     | ${'\n'}
        ${String.raw`\r`}                     | ${'\r'}
        ${String.raw`\t`}                     | ${'\t'}
        ${String.raw`\v`}                     | ${'\v'}
        ${String.raw`\x1b`}                   | ${'\x1b'}
        ${String.raw`\0\b\f\n\r\t\v\x1b`}     | ${'\0\b\f\n\r\t\v\x1b'}
        ${String.raw`\xa9`}                   | ${'©'}
        ${String.raw`\u{a9}`}                 | ${'©'}
        ${String.raw`\u3042`}                 | ${'あ'}
        ${String.raw`\u{3042}`}               | ${'あ'}
        ${String.raw`\u{1f170}`}              | ${'🅰'}
        ${String.raw`\u{2fa1a}`}              | ${'鼏'}
        ${String.raw`\u{0000000000000000a9}`} | ${'©'}
        ${String.raw`\u{000000000000003042}`} | ${'あ'}
        ${String.raw`\u{00000000000001f170}`} | ${'🅰'}
        ${String.raw`\u{00000000000002fa1a}`} | ${'鼏'}
        ${String.raw`\'`}                     | ${"'"}
        ${String.raw`\"`}                     | ${'"'}
        ${String.raw`\\`}                     | ${'\\'}
    `('$escaped', ({ escaped, expected }: Record<string, string>) => {
        expect(unescape(escaped)).toBe(expected);
    });

    test.each`
        seq                 | errorMessage
        ${'01'}             | ${`Octal escape sequences are not allowed. Use the syntax '\\x01'`}
        ${'07'}             | ${`Octal escape sequences are not allowed. Use the syntax '\\x07'`}
        ${'08'}             | ${`Octal escape sequences are not allowed. Use the syntax '\\x00'`}
        ${'09'}             | ${`Octal escape sequences are not allowed. Use the syntax '\\x00'`}
        ${'1'}              | ${`Octal escape sequences are not allowed. Use the syntax '\\x01'`}
        ${'7'}              | ${`Octal escape sequences are not allowed. Use the syntax '\\x07'`}
        ${'8'}              | ${`Parsing error: Escape sequence '\\8' is not allowed.`}
        ${'9'}              | ${`Parsing error: Escape sequence '\\9' is not allowed.`}
        ${'xa'}             | ${`Parsing error: Hexadecimal digit expected.: '\\xa'`}
        ${'xanadu'}         | ${`Parsing error: Hexadecimal digit expected.: '\\xan'`}
        ${'uce'}            | ${`Parsing error: Hexadecimal digit expected.: '\\uce'`}
        ${'uncle'}          | ${`Parsing error: Hexadecimal digit expected.: '\\uncle'`}
        ${'u{110000}'}      | ${`Parsing error: An extended Unicode escape value must be between 0x0 and 0x10FFFF inclusive.: '\\u{110000}'`}
        ${'u{00000110000}'} | ${`Parsing error: An extended Unicode escape value must be between 0x0 and 0x10FFFF inclusive.: '\\u{00000110000}'`}
        ${'a'}              | ${`Unnecessary escape character: '\\a'`}
        ${'#'}              | ${`Unnecessary escape character: '\\#'`}
        ${'©'}             | ${`Unnecessary escape character: '\\©'`}
        ${'あ'}             | ${`Unnecessary escape character: '\\あ'`}
        ${'🅰'}             | ${`Unnecessary escape character: '\\🅰'`}
        ${'鼏'}             | ${`Unnecessary escape character: '\\鼏'`}
    `('Unsupported escape sequence \\$seq', ({ seq, errorMessage }) => {
        const mock = jest.spyOn(console, 'error').mockReturnValue();
        try {
            expect(unescape(`\\${seq}`)).toBe(seq);
            expect(mock).toHaveBeenCalledTimes(1);
            expect(mock).toHaveBeenNthCalledWith(1, errorMessage);
        } finally {
            mock.mockRestore();
        }
    });
});
