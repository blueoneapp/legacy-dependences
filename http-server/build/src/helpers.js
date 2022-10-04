"use strict";
/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statFn = exports.normalizeMakeSignedUrlOptions = exports.normalizeMakeUrlOptions = exports.trustProxy = exports.useReturnValue = exports.processPattern = exports.toRoutesJSON = exports.dropSlash = void 0;
/// <reference path="../adonis-typings/index.ts" />
const quick_lru_1 = __importDefault(require("quick-lru"));
const fs_1 = require("fs");
const Group_1 = require("./Router/Group");
const BriskRoute_1 = require("./Router/BriskRoute");
const Resource_1 = require("./Router/Resource");
const RouterException_1 = require("./Exceptions/RouterException");
const proxyCache = new quick_lru_1.default({ maxSize: 100 });
/**
 * Makes input string consistent by having only the starting
 * slash
 */
function dropSlash(input) {
    if (input === '/') {
        return '/';
    }
    return `/${input.replace(/^\//, '').replace(/\/$/, '')}`;
}
exports.dropSlash = dropSlash;
/**
 * Converts and array of routes or route groups or route resource to a flat
 * list of route defination.
 */
function toRoutesJSON(routes) {
    return routes.reduce((list, route) => {
        if (route instanceof Group_1.RouteGroup) {
            list = list.concat(toRoutesJSON(route.routes));
            return list;
        }
        if (route instanceof Resource_1.RouteResource) {
            list = list.concat(toRoutesJSON(route.routes));
            return list;
        }
        if (route instanceof BriskRoute_1.BriskRoute) {
            if (route.route) {
                list.push(route.route.toJSON());
            }
            return list;
        }
        if (!route.deleted) {
            list.push(route.toJSON());
        }
        return list;
    }, []);
}
exports.toRoutesJSON = toRoutesJSON;
/**
 * Makes url for a route pattern and params and querystring.
 */
function processPattern(pattern, data) {
    let url = pattern;
    if (url.indexOf(':') > -1) {
        /*
         * Split pattern when route has dynamic segments
         */
        const tokens = url.split('/');
        /*
         * Lookup over the route tokens and replace them the params values
         */
        url = tokens
            .map((token) => {
            if (!token.startsWith(':')) {
                return token;
            }
            const isOptional = token.endsWith('?');
            const paramName = token.replace(/^:/, '').replace(/\?$/, '');
            const param = data[paramName];
            /*
             * A required param is always required to make the complete URL
             */
            if (!param && !isOptional) {
                throw RouterException_1.RouterException.cannotMakeRoute(paramName, pattern);
            }
            return param;
        })
            .join('/');
    }
    return url;
}
exports.processPattern = processPattern;
/**
 * Returns a boolean telling if the return value must be used as
 * the response body or not
 */
function useReturnValue(returnValue, ctx) {
    return (returnValue !== undefined && // Return value is explicitly defined
        returnValue !== ctx.response && // Return value is not the instance of response object
        !ctx.response.hasLazyBody // Lazy body is not set
    );
}
exports.useReturnValue = useReturnValue;
/**
 * Since finding the trusted proxy based upon the remote address
 * is an expensive function, we cache its result
 */
function trustProxy(remoteAddress, proxyFn) {
    if (proxyCache.has(remoteAddress)) {
        return proxyCache.get(remoteAddress);
    }
    const result = proxyFn(remoteAddress, 0);
    proxyCache.set(remoteAddress, result);
    return result;
}
exports.trustProxy = trustProxy;
/**
 * Normalizes the make url options by allowing params to appear on
 * top level object with option to nest inside `params` property.
 */
function normalizeMakeUrlOptions(options) {
    const params = options ? (options.params ? options.params : options) : {};
    const qs = options && options.qs ? options.qs : {};
    const domainParams = options && options.domainParams ? options.domainParams : {};
    const prefixDomain = options && options.prefixDomain !== undefined ? options.prefixDomain : true;
    return { params, qs, domainParams, prefixDomain };
}
exports.normalizeMakeUrlOptions = normalizeMakeUrlOptions;
/**
 * Normalizes the make signed url options by allowing params to appear on
 * top level object with option to nest inside `params` property.
 */
function normalizeMakeSignedUrlOptions(options) {
    const params = options ? (options.params ? options.params : options) : {};
    const qs = options && options.qs ? options.qs : {};
    const domainParams = options && options.domainParams ? options.domainParams : {};
    const prefixDomain = options && options.prefixDomain !== undefined ? options.prefixDomain : true;
    const expiresIn = options && options.expiresIn !== undefined ? options.expiresIn : undefined;
    const purpose = options && options.purpose ? options.purpose : undefined;
    return {
        params,
        qs,
        domainParams,
        prefixDomain,
        expiresIn,
        purpose,
    };
}
exports.normalizeMakeSignedUrlOptions = normalizeMakeSignedUrlOptions;
/**
 * Wraps `fs.stat` to promise interface.
 */
function statFn(filePath) {
    return new Promise((resolve, reject) => {
        fs_1.stat(filePath, (error, stats) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stats);
        });
    });
}
exports.statFn = statFn;
