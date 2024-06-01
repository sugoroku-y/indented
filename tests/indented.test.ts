import { indented } from '../src';

describe('indented', () => {
    test('standard', () => {
        expect(indented`
      abc
      ${true}
      def
      `).toBe('abc\ntrue\ndef');
    });
    test('not indented end', () => {
        expect(indented`
      abc
      ${true}
      def`).toBe('\n      abc\n      true\n      def');
    });
    test('not indented begin', () => {
        expect(indented`abc
      ${true}
      def
      `).toBe('abc\n      true\n      def\n      ');
    });
    test('not indented partial', () => {
        expect(indented`
      abc
  ${true}
      def
      `).toBe('abc\n  true\ndef');
    });
    test('indented with escape', () => {
        expect(indented`
      abc\
      ${true}
      def\
      `).toBe('abctrue\ndef');
    });
    test.each`
        n
        ${1}
        ${2}
    `('cache$n', ({ n }) => {
        expect(indented`
      abc
      ${n}
      def
      `).toBe(`abc\n${n}\ndef`);
    });
});
