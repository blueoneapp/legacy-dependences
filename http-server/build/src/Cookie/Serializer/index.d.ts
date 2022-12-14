/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { CookieOptions } from '@ioc:Adonis/Core/Response';
import { EncryptionContract } from '@ioc:Adonis/Core/Encryption';
/**
 * Cookies serializer is used to serialize a value to be set on the `Set-Cookie`
 * header. You can `encode`, `sign` on `encrypt` cookies using the serializer
 * and then set them individually using the `set-cookie` header.
 */
export declare class CookieSerializer {
    private encryption;
    constructor(encryption: EncryptionContract);
    /**
     * Serializes the key-value pair to a string, that can be set on the
     * `Set-Cookie` header.
     */
    private serializeAsCookie;
    /**
     * Encodes value as a plain cookie. Do note, the value is still JSON.stringified
     * and converted to base64 encoded string to avoid encoding issues.
     *
     * @example
     * ```ts
     *  serializer.encode('name', 'virk')
     * ```
     */
    encode(key: string, value: any, options?: Partial<CookieOptions>): string | null;
    /**
     * Signs the value and returns it back as a url safe string. The signed value
     * has a verification hash attached to it to detect data tampering.
     */
    sign(key: string, value: any, options?: Partial<CookieOptions>): string | null;
    /**
     * Encrypts the value and returns it back as a url safe string.
     */
    encrypt(key: string, value: any, options?: Partial<CookieOptions>): string | null;
}
