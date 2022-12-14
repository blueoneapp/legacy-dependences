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
exports.CookieSerializer = void 0;
const ms_1 = __importDefault(require("ms"));
const cookie_1 = __importDefault(require("cookie"));
const PlainCookie = __importStar(require("../Drivers/Plain"));
const SignedCookie = __importStar(require("../Drivers/Signed"));
const EncryptedCookie = __importStar(require("../Drivers/Encrypted"));
/**
 * Cookies serializer is used to serialize a value to be set on the `Set-Cookie`
 * header. You can `encode`, `sign` on `encrypt` cookies using the serializer
 * and then set them individually using the `set-cookie` header.
 */
class CookieSerializer {
    constructor(encryption) {
        this.encryption = encryption;
    }
    /**
     * Serializes the key-value pair to a string, that can be set on the
     * `Set-Cookie` header.
     */
    serializeAsCookie(key, value, options) {
        /**
         * Invoked expires method to get the date
         */
        let expires = options === null || options === void 0 ? void 0 : options.expires;
        if (typeof expires === 'function') {
            expires = expires();
        }
        /**
         * Parse string based max age to number
         */
        let maxAge = options === null || options === void 0 ? void 0 : options.maxAge;
        if (typeof maxAge === 'string') {
            maxAge = ms_1.default(maxAge) / 1000;
        }
        const parsedOptions = Object.assign({}, options, { maxAge, expires });
        return cookie_1.default.serialize(key, value, parsedOptions);
    }
    /**
     * Encodes value as a plain cookie. Do note, the value is still JSON.stringified
     * and converted to base64 encoded string to avoid encoding issues.
     *
     * @example
     * ```ts
     *  serializer.encode('name', 'virk')
     * ```
     */
    encode(key, value, options) {
        const packedValue = PlainCookie.pack(value);
        if (packedValue === null) {
            return null;
        }
        return this.serializeAsCookie(key, packedValue, options);
    }
    /**
     * Signs the value and returns it back as a url safe string. The signed value
     * has a verification hash attached to it to detect data tampering.
     */
    sign(key, value, options) {
        const packedValue = SignedCookie.pack(key, value, this.encryption);
        if (packedValue === null) {
            return null;
        }
        return this.serializeAsCookie(key, packedValue, options);
    }
    /**
     * Encrypts the value and returns it back as a url safe string.
     */
    encrypt(key, value, options) {
        const packedValue = EncryptedCookie.pack(key, value, this.encryption);
        if (packedValue === null) {
            return null;
        }
        return this.serializeAsCookie(key, packedValue, options);
    }
}
exports.CookieSerializer = CookieSerializer;
