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
exports.BriskRoute = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const macroable_1 = require("macroable");
const utils_1 = require("@poppinss/utils");
const Route_1 = require("./Route");
/**
 * Brisk route enables you to expose expressive API for
 * defining route handler.
 *
 * For example: AdonisJs uses [[BriskRoute]] `Route.on().render()`
 * to render a view without defining a controller method or
 * closure.
 */
class BriskRoute extends macroable_1.Macroable {
    constructor(pattern, globalMatchers) {
        super();
        this.pattern = pattern;
        this.globalMatchers = globalMatchers;
        /**
         * Invoked by is reference to the parent method that calls `setHandler` on
         * this class. We keep a reference to the parent method name for raising
         * meaningful exception
         */
        this.invokedBy = '';
        /**
         * Reference to route instance. Set after `setHandler` is called
         */
        this.route = null;
    }
    /**
     * Set handler for the brisk route. The `invokedBy` string is the reference
     * to the method that calls this method. It is required to create human
     * readable error message when `setHandler` is called for multiple
     * times.
     */
    setHandler(handler, invokedBy, methods) {
        if (this.route) {
            throw new utils_1.Exception(`\`Route.${invokedBy}\` and \`${this.invokedBy}\` cannot be called together`, 500, 'E_MULTIPLE_BRISK_HANDLERS');
        }
        this.route = new Route_1.Route(this.pattern, methods || ['GET'], handler, this.globalMatchers);
        this.invokedBy = invokedBy;
        return this.route;
    }
}
exports.BriskRoute = BriskRoute;
BriskRoute.macros = {};
BriskRoute.getters = {};
