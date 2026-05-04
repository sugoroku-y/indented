"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
class Cache {
    cache = new WeakMap();
    newInstance;
    constructor(_newInstance) {
        this.newInstance = (key) => {
            const value = _newInstance(key);
            this.cache.set(key, value);
            return value;
        };
    }
    get(key) {
        return this.cache.get(key) ?? this.newInstance(key);
    }
    delete(key) {
        return this.cache.delete(key);
    }
    has(key) {
        return this.cache.has(key);
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map