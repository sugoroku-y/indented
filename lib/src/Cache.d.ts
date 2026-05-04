export declare class Cache<Key extends WeakKey, Value extends Record<never, never>> {
    private cache;
    private newInstance;
    constructor(_newInstance: (key: Key) => Value);
    get(key: Key): Value;
    delete(key: Key): boolean;
    has(key: Key): boolean;
}
