export class Cache<Key extends WeakKey, Value extends Record<never, never>> {
    private cache = new WeakMap<Key, Value>();
    private newInstance: (key: Key) => Value;

    constructor(_newInstance: (key: Key) => Value) {
        this.newInstance = (key) => {
            const value = _newInstance(key);
            this.cache.set(key, value);
            return value;
        };
    }

    get(key: Key): Value {
        return this.cache.get(key) ?? this.newInstance(key);
    }

    delete(key: Key): boolean {
        return this.cache.delete(key);
    }

    has(key: Key): boolean {
        return this.cache.has(key);
    }
}
