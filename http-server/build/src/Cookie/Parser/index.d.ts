/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { EncryptionContract } from '@ioc:Adonis/Core/Encryption';
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
export declare class CookieParser {
    private cookieHeader;
    private encryption;
    /**
     * A copy of cached cookies, they are cached during a request after
     * initial decoding, unsigning or decrypting.
     */
    private cachedCookies;
    /**
     * An object of key-value pair collected by parsing
     * the request cookie header.
     */
    private cookies;
    constructor(cookieHeader: string, encryption: EncryptionContract);
    /**
     * Parses the request `cookie` header
     */
    private parse;
    /**
     * Attempts to decode a cookie by the name. When calling this method,
     * you are assuming that the cookie was just encoded at the first
     * place and not signed or encrypted.
     */
    decode(key: string): any | null;
    /**
     * Attempts to unsign a cookie by the name. When calling this method,
     * you are assuming that the cookie was signed at the first place.
     */
    unsign(key: string): null | any;
    /**
     * Attempts to decrypt a cookie by the name. When calling this method,
     * you are assuming that the cookie was encrypted at the first place.
     */
    decrypt(key: string): null | any;
    /**
     * Returns an object of cookies key-value pair. Do note, the
     * cookies are not decoded, unsigned or decrypted inside this
     * list.
     */
    list(): {
        [key: string]: any;
    };
}
