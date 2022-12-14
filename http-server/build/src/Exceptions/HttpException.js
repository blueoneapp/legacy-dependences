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
exports.HttpException = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const utils_1 = require("@poppinss/utils");
const exceptions_json_1 = require("../../exceptions.json");
/**
 * Custom exception to abort requests as one liners
 */
class HttpException extends utils_1.Exception {
    /**
     * This method returns an instance of the exception class
     */
    static invoke(body, status, code) {
        const message = exceptions_json_1.E_HTTP_EXCEPTION.message;
        code = code || exceptions_json_1.E_HTTP_EXCEPTION.code;
        if (body !== null && typeof body === 'object') {
            const error = new this(body.message || utils_1.interpolate(message, { status }), status, code);
            error.body = body;
            return error;
        }
        const error = new this(body || utils_1.interpolate(message, { status }), status, code);
        error.body = error.message;
        return error;
    }
}
exports.HttpException = HttpException;
