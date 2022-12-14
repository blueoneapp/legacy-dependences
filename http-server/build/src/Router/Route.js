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
exports.Route = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const macroable_1 = require("macroable");
const helpers_1 = require("../helpers");
/**
 * Route class is used to construct consistent [[RouteDefinition]] using
 * fluent API. An instance of route is usually obtained using the
 * [[Router]] class helper methods.
 *
 * @example
 * ```ts
 * const route = new Route('posts/:id', ['GET'], async function () {
 * })
 *
 * route
 *   .where('id', /^[0-9]+$/)
 *   .middleware(async function () {
 *   })
 * ```
 */
class Route extends macroable_1.Macroable {
    constructor(pattern, methods, handler, globalMatchers) {
        super();
        this.pattern = pattern;
        this.methods = methods;
        this.handler = handler;
        this.globalMatchers = globalMatchers;
        /**
         * By default the route is part of `root` domain. Root
         * domain is used when no domain is defined
         */
        this.routeDomain = 'root';
        /**
         * An object of matchers to be forwarded to the
         * store. The matchers list is populated by
         * calling `where` method
         */
        this.matchers = {};
        /**
         * Custom prefixes. Usually added to a group of routes. We keep an array of them
         * since nested groups will want all of them ot concat.
         */
        this.prefixes = [];
        /**
         * An array of middleware. Added using `middleware` function
         */
        this.routeMiddleware = [];
        /**
         * A boolean to prevent route from getting registered within
         * the [[Store]].
         *
         * This flag must be set before [[Router.commit]] method
         */
        this.deleted = false;
    }
    /**
     * Returns an object of param matchers by merging global and local
     * matchers. The local copy is given preference over the global
     * one's
     */
    getMatchers() {
        return Object.assign({}, this.globalMatchers, this.matchers);
    }
    /**
     * Returns a normalized pattern string by prefixing the `prefix` (if defined).
     */
    getPattern() {
        const pattern = helpers_1.dropSlash(this.pattern);
        const prefix = this.prefixes
            .slice()
            .reverse()
            .map((one) => helpers_1.dropSlash(one))
            .join('');
        return prefix ? `${prefix}${pattern === '/' ? '' : pattern}` : pattern;
    }
    /**
     * Define Regex matcher for a given param. If a matcher exists, then we do not
     * override that, since the routes inside a group will set matchers before
     * the group, so they should have priority over the route matchers.
     *
     * ```
     * Route.group(() => {
     *   Route.get('/:id', 'handler').where('id', /^[0-9]$/)
     * }).where('id', /[^a-z$]/)
     * ```
     *
     * The `/^[0-9]$/` should win over the matcher defined by the group
     */
    where(param, matcher) {
        if (this.matchers[param]) {
            return this;
        }
        this.matchers[param] = typeof matcher === 'string' ? new RegExp(matcher) : matcher;
        return this;
    }
    /**
     * Define prefix for the route. Prefixes will be concated
     * This method is mainly exposed for the [[RouteGroup]]
     */
    prefix(prefix) {
        this.prefixes.push(prefix);
        return this;
    }
    /**
     * Define a custom domain for the route. Again we do not overwrite the domain
     * unless `overwrite` flag is set to true.
     *
     * This is again done to make route.domain win over route.group.domain
     */
    domain(domain, overwrite = false) {
        if (this.routeDomain === 'root' || overwrite) {
            this.routeDomain = domain;
        }
        return this;
    }
    /**
     * Define an array of middleware to be executed on the route. If `prepend`
     * is true, then middleware will be added to start of the existing
     * middleware. The option is exposed for [[RouteGroup]]
     */
    middleware(middleware, prepend = false) {
        middleware = Array.isArray(middleware) ? middleware : [middleware];
        this.routeMiddleware = prepend
            ? middleware.concat(this.routeMiddleware)
            : this.routeMiddleware.concat(middleware);
        return this;
    }
    /**
     * Give memorizable name to the route. This is helpful, when you
     * want to lookup route defination by it's name.
     *
     * If `prepend` is true, then it will keep on prepending to the existing
     * name. This option is exposed for [[RouteGroup]]
     */
    as(name, prepend = false) {
        this.name = prepend ? `${name}.${this.name}` : name;
        return this;
    }
    /**
     * Define controller namespace for a given route
     */
    namespace(namespace, overwrite = false) {
        if (!this.routeNamespace || overwrite) {
            this.routeNamespace = namespace;
        }
        return this;
    }
    /**
     * Returns [[RouteDefinition]] that can be passed to the [[Store]] for
     * registering the route
     */
    toJSON() {
        return {
            domain: this.routeDomain,
            pattern: this.getPattern(),
            matchers: this.getMatchers(),
            meta: {
                namespace: this.routeNamespace,
            },
            name: this.name,
            handler: this.handler,
            methods: this.methods,
            middleware: this.routeMiddleware,
        };
    }
}
exports.Route = Route;
Route.macros = {};
Route.getters = {};
