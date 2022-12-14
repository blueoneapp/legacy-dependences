/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../adonis-typings/index.d.ts" />
import { Macroable } from 'macroable';
import { RouteJSON, RouteMatchers, RouteContract, RouteHandler } from '@ioc:Adonis/Core/Route';
import { MiddlewareHandler } from '@ioc:Adonis/Core/Middleware';
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
export declare class Route extends Macroable implements RouteContract {
    private pattern;
    private methods;
    private handler;
    private globalMatchers;
    protected static macros: {};
    protected static getters: {};
    /**
     * By default the route is part of `root` domain. Root
     * domain is used when no domain is defined
     */
    private routeDomain;
    /**
     * An object of matchers to be forwarded to the
     * store. The matchers list is populated by
     * calling `where` method
     */
    private matchers;
    /**
     * Custom prefixes. Usually added to a group of routes. We keep an array of them
     * since nested groups will want all of them ot concat.
     */
    private prefixes;
    /**
     * An array of middleware. Added using `middleware` function
     */
    private routeMiddleware;
    /**
     * Storing the namespace explicitly set using `route.namespace` method
     */
    private routeNamespace;
    /**
     * A boolean to prevent route from getting registered within
     * the [[Store]].
     *
     * This flag must be set before [[Router.commit]] method
     */
    deleted: boolean;
    /**
     * A unique name to lookup the route
     */
    name: string;
    constructor(pattern: string, methods: string[], handler: RouteHandler, globalMatchers: RouteMatchers);
    /**
     * Returns an object of param matchers by merging global and local
     * matchers. The local copy is given preference over the global
     * one's
     */
    private getMatchers;
    /**
     * Returns a normalized pattern string by prefixing the `prefix` (if defined).
     */
    private getPattern;
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
    where(param: string, matcher: string | RegExp): this;
    /**
     * Define prefix for the route. Prefixes will be concated
     * This method is mainly exposed for the [[RouteGroup]]
     */
    prefix(prefix: string): this;
    /**
     * Define a custom domain for the route. Again we do not overwrite the domain
     * unless `overwrite` flag is set to true.
     *
     * This is again done to make route.domain win over route.group.domain
     */
    domain(domain: string, overwrite?: boolean): this;
    /**
     * Define an array of middleware to be executed on the route. If `prepend`
     * is true, then middleware will be added to start of the existing
     * middleware. The option is exposed for [[RouteGroup]]
     */
    middleware(middleware: MiddlewareHandler | MiddlewareHandler[], prepend?: boolean): this;
    /**
     * Give memorizable name to the route. This is helpful, when you
     * want to lookup route defination by it's name.
     *
     * If `prepend` is true, then it will keep on prepending to the existing
     * name. This option is exposed for [[RouteGroup]]
     */
    as(name: string, prepend?: boolean): this;
    /**
     * Define controller namespace for a given route
     */
    namespace(namespace: string, overwrite?: boolean): this;
    /**
     * Returns [[RouteDefinition]] that can be passed to the [[Store]] for
     * registering the route
     */
    toJSON(): RouteJSON;
}
