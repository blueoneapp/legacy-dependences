"use strict";
/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieParser = void 0;
const cookie_1 = __importDefault(require("cookie"));
const PlainCookie = __importStar(require("../Drivers/Plain"));
const SignedCookie = __importStar(require("../Drivers/Signed"));
const EncryptedCookie = __importStar(require("../Drivers/Encrypted"));
/**
 * Cookie parser parses the HTTP `cookie` method and collects all cookies
 * inside an object of `key-value` pair, but doesn't attempt to decrypt
 * or unsign or decode the individual values.
 *
 * The cookie values are lazily decrypted, or unsigned to avoid unncessary
 * processing, which infact can be used as a means to burden the server
 * by sending too many cookies which even doesn't belongs to the
 * server.
 */
class CookieParser {
    constructor(cookieHeader, encryption) {
        this.cookieHeader = cookieHeader;
        this.encryption = encryption;
        /**
         * A copy of cached cookies, they are cached during a request after
         * initial decoding, unsigning or decrypting.
         */
        this.cachedCookies = {
            signedCookies: {},
            plainCookies: {},
            encryptedCookies: {},
        };
        /**
         * An object of key-value pair collected by parsing
         * the request cookie header.
         */
        this.cookies = this.parse();
    }
    /**
     * Parses the request `cookie` header
     */
    parse() {
        /*
         * Set to empty object when cookie header is empty string
         */
        if (!this.cookieHeader) {
            return {};
        }
        /*
         * Parse and store reference
         */
        return cookie_1.default.parse(this.cookieHeader);
    }
    /**
     * Attempts to decode a cookie by the name. When calling this method,
     * you are assuming that the cookie was just encoded at the first
     * place and not signed or encrypted.
     */
    decode(key) {
        /*
         * Ignore when initial value is not defined or null
         */
        const value = this.cookies[key];
        if (value === null || value === undefined) {
            return null;
        }
        /*
         * Reference to the cache object. Mainly done to avoid typos,
         * since this object is referenced a handful of times inside
         * this method.
         */
        const cacheObject = this.cachedCookies.plainCookies;
        /*
         * Return from cache, when already parsed
         */
        if (cacheObject[key] !== undefined) {
            return cacheObject[key];
        }
        /*
         * Attempt to unpack and cache it for future. The value is only
         * when value it is not null.
         */
        const parsed = PlainCookie.canUnpack(value) ? PlainCookie.unpack(value) : null;
        if (parsed !== null) {
            cacheObject[key] = parsed;
        }
        return parsed;
    }
    /**
     * Attempts to unsign a cookie by the name. When calling this method,
     * you are assuming that the cookie was signed at the first place.
     */
    unsign(key) {
        /*
         * Ignore when initial value is not defined or null
         */
        const value = this.cookies[key];
        if (value === null || value === undefined) {
            return null;
        }
        /*
         * Reference to the cache object. Mainly done to avoid typos,
         * since this object is referenced a handful of times inside
         * this method.
         */
        const cacheObject = this.cachedCookies.signedCookies;
        /*
         * Return from cache, when already parsed
         */
        if (cacheObject[key] !== undefined) {
            return cacheObject[key];
        }
        /*
         * Attempt to unpack and cache it for future. The value is only
         * when value it is not null.
         */
        const parsed = SignedCookie.canUnpack(value)
            ? SignedCookie.unpack(key, value, this.encryption)
            : null;
        if (parsed !== null) {
            cacheObject[key] = parsed;
        }
        return parsed;
    }
    /**
     * Attempts to decrypt a cookie by the name. When calling this method,
     * you are assuming that the cookie was encrypted at the first place.
     */
    decrypt(key) {
        /*
         * Ignore when initial value is not defined or null
         */
        const value = this.cookies[key];
        if (value === null || value === undefined) {
            return null;
        }
        /*
         * Reference to the cache object. Mainly done to avoid typos,
         * since this object is referenced a handful of times inside
         * this method.
         */
        const cacheObject = this.cachedCookies.encryptedCookies;
        /*
         * Return from cache, when already parsed
         */
        if (cacheObject[key] !== undefined) {
            return cacheObject[key];
        }
        /*
         * Attempt to unpack and cache it for future. The value is only
         * when value it is not null.
         */
        const parsed = EncryptedCookie.canUnpack(value)
            ? EncryptedCookie.unpack(key, value, this.encryption)
            : null;
        if (parsed !== null) {
            cacheObject[key] = parsed;
        }
        return parsed;
    }
    /**
     * Returns an object of cookies key-value pair. Do note, the
     * cookies are not decoded, unsigned or decrypted inside this
     * list.
     */
    list() {
        return this.cookies;
    }
}
exports.CookieParser = CookieParser;
