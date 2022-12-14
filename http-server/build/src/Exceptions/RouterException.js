"use strict";
/*
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterException = void 0;
const utils_1 = require("@poppinss/utils");
const exceptions_json_1 = require("../../exceptions.json");
/**
 * Exceptions related to the HTTP router
 */
class RouterException extends utils_1.Exception {
    /**
     * Raised when one of the routes inside the group doesn't have a name
     * but an attempt is made to name the group
     */
    static cannotDefineGroupName() {
        const error = new this(exceptions_json_1.E_CANNOT_DEFINE_GROUP_NAME.message, exceptions_json_1.E_CANNOT_DEFINE_GROUP_NAME.status, exceptions_json_1.E_CANNOT_DEFINE_GROUP_NAME.code);
        error.help = exceptions_json_1.E_CANNOT_DEFINE_GROUP_NAME.help.join('\n');
        throw error;
    }
    /**
     * Raised when a duplicate route pattern is find for the same HTTP method
     */
    static duplicateRoute(method, pattern) {
        const error = new this(utils_1.interpolate(exceptions_json_1.E_DUPLICATE_ROUTE.message, { method, pattern }), exceptions_json_1.E_DUPLICATE_ROUTE.status, exceptions_json_1.E_DUPLICATE_ROUTE.code);
        error.help = exceptions_json_1.E_DUPLICATE_ROUTE.help.join('\n');
        throw error;
    }
    /**
     * Raised when a route has duplicate params
     */
    static duplicateRouteParam(param, pattern) {
        return new this(utils_1.interpolate(exceptions_json_1.E_DUPLICATE_ROUTE_PARAM.message, { param, pattern }), exceptions_json_1.E_DUPLICATE_ROUTE_PARAM.status, exceptions_json_1.E_DUPLICATE_ROUTE_PARAM.code);
    }
    /**
     * Raised when route name is not unique
     */
    static duplicateRouteName(name) {
        const error = new this(utils_1.interpolate(exceptions_json_1.E_DUPLICATE_ROUTE_NAME.message, { name }), exceptions_json_1.E_DUPLICATE_ROUTE_NAME.status, exceptions_json_1.E_DUPLICATE_ROUTE_NAME.code);
        error.help = exceptions_json_1.E_DUPLICATE_ROUTE_NAME.help.join('\n');
        throw error;
    }
    /**
     * Raised when unable to make url for a given route, because one of the
     * params value is not defined
     */
    static cannotMakeRoute(param, pattern) {
        const error = new this(utils_1.interpolate(exceptions_json_1.E_CANNOT_MAKE_ROUTE_URL.message, { pattern, param }), exceptions_json_1.E_CANNOT_MAKE_ROUTE_URL.status, exceptions_json_1.E_CANNOT_MAKE_ROUTE_URL.code);
        error.help = exceptions_json_1.E_CANNOT_MAKE_ROUTE_URL.help.join('\n');
        throw error;
    }
    /**
     * Raised when unable to lookup a route using its identifier
     */
    static cannotLookupRoute(identifier) {
        const error = new this(utils_1.interpolate(exceptions_json_1.E_CANNOT_LOOKUP_ROUTE.message, { identifier }), exceptions_json_1.E_CANNOT_LOOKUP_ROUTE.status, exceptions_json_1.E_CANNOT_LOOKUP_ROUTE.code);
        error.help = exceptions_json_1.E_CANNOT_LOOKUP_ROUTE.help.join('\n');
        throw error;
    }
}
exports.RouterException = RouterException;
