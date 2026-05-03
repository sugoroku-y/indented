import { Cache } from '../src/Cache';

describe('Cache', () => {
    test('creates and caches a value for a missing key', () => {
        const newInstance = jest.fn(() => ({}));
        const cache = new Cache(newInstance);

        const key = {};
        const firstValue = cache.get(key);
        const secondValue = cache.get(key);

        expect(firstValue).toBe(secondValue);
        expect(newInstance).toHaveBeenCalledTimes(1);
        expect(cache.has(key)).toBe(true);
    });

    test('delete removes the cached value and returns booleans appropriately', () => {
        const cache = new Cache(() => ({}));

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
