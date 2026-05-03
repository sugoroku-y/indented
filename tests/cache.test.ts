import { Cache } from '../src/Cache';

describe('Cache', () => {
    test('creates and caches a value for a missing key', () => {
        let createCount = 0;
        const cache = new Cache((_key: object) => {
            createCount += 1;
            return {};
        });

        const key = {};
        const firstValue = cache.get(key);
        const secondValue = cache.get(key);

        expect(firstValue).toBe(secondValue);
        expect(createCount).toBe(1);
        expect(cache.has(key)).toBe(true);
    });

    test('delete removes the cached value and returns booleans appropriately', () => {
        const cache = new Cache((_key: object) => {
            return {};
        });

        const key = {};

        expect(cache.has(key)).toBe(false);
        expect(cache.delete(key)).toBe(false);

        const value = cache.get(key);
        expect(value).toBeDefined();
        expect(cache.has(key)).toBe(true);
        expect(cache.delete(key)).toBe(true);
        expect(cache.has(key)).toBe(false);
        expect(cache.delete(key)).toBe(false);
    });
});
