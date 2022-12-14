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
exports.RouteGroup = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const macroable_1 = require("macroable");
const BriskRoute_1 = require("./BriskRoute");
const Resource_1 = require("./Resource");
const RouterException_1 = require("../Exceptions/RouterException");
/**
 * Group class exposes the API to take action on a group of routes.
 * The group routes must be pre-defined using the constructor.
 */
class RouteGroup extends macroable_1.Macroable {
    constructor(routes) {
        super();
        this.routes = routes;
    }
    /**
     * Invokes a given method with params on the route instance or route
     * resource instance
     */
    invoke(route, method, params) {
        if (route instanceof Resource_1.RouteResource) {
            route.routes.forEach((child) => this.invoke(child, method, params));
            return;
        }
        if (route instanceof RouteGroup) {
            route[method](...params);
            return;
        }
        if (route instanceof BriskRoute_1.BriskRoute) {
            /* istanbul ignore else */
            if (route.route) {
                /*
                 * Raise error when trying to prefix route name but route doesn't have
                 * a name
                 */
                if (method === 'as' && !route.route.name) {
                    throw RouterException_1.RouterException.cannotDefineGroupName();
                }
                route.route[method](...params);
            }
            return;
        }
        /*
         * Raise error when trying to prefix route name but route doesn't have
         * a name
         */
        if (method === 'as' && !route.name) {
            throw RouterException_1.RouterException.cannotDefineGroupName();
        }
        route[method](...params);
    }
    /**
     * Define Regex matchers for a given param for all the routes.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).where('id', /^[0-9]+/)
     * ```
     */
    where(param, matcher) {
        this.routes.forEach((route) => this.invoke(route, 'where', [param, matcher]));
        return this;
    }
    /**
     * Define prefix all the routes in the group.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).prefix('v1')
     * ```
     */
    prefix(prefix) {
        this.routes.forEach((route) => this.invoke(route, 'prefix', [prefix]));
        return this;
    }
    /**
     * Define domain for all the routes.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).domain(':name.adonisjs.com')
     * ```
     */
    domain(domain) {
        this.routes.forEach((route) => this.invoke(route, 'domain', [domain]));
        return this;
    }
    /**
     * Prepend name to the routes name.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).as('version1')
     * ```
     */
    as(name) {
        this.routes.forEach((route) => this.invoke(route, 'as', [name, true]));
        return this;
    }
    /**
     * Prepend an array of middleware to all routes middleware.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).middleware(['auth'])
     * ```
     */
    middleware(middleware) {
        this.routes.forEach((route) => this.invoke(route, 'middleware', [middleware, true]));
        return this;
    }
    /**
     * Define namespace for all the routes inside the group.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).namespace('App/Admin/Controllers')
     * ```
     */
    namespace(namespace) {
        this.routes.forEach((route) => this.invoke(route, 'namespace', [namespace]));
        return this;
    }
}
exports.RouteGroup = RouteGroup;
RouteGroup.macros = {};
RouteGroup.getters = {};
