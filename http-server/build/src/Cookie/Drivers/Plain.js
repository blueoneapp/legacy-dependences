"use strict";
/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpack = exports.canUnpack = exports.pack = void 0;
const utils_1 = require("@poppinss/utils");
/**
 * Encodes a value into a base64 url encoded string to
 * be set as cookie
 */
function pack(value) {
    if (value === undefined || value === null) {
        return null;
    }
    return utils_1.base64.urlEncode(new utils_1.MessageBuilder().build(value));
}
exports.pack = pack;
/**
 * Returns true when this `unpack` method of this module can attempt
 * to unpack the encode value.
 */
function canUnpack(encodedValue) {
    return typeof encodedValue === 'string';
}
exports.canUnpack = canUnpack;
/**
 * Attempts to unpack the value by decoding it. Make sure to call, `canUnpack`
 * before calling this method
 */
function unpack(encodedValue) {
    const verified = new utils_1.MessageBuilder().verify(utils_1.base64.urlDecode(encodedValue, 'utf-8', true));
    return verified === undefined ? null : verified;
}
exports.unpack = unpack;
