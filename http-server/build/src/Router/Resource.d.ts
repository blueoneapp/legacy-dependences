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
import { MiddlewareHandler } from '@ioc:Adonis/Core/Middleware';
import { RouteMatchers, RouteResourceContract, ResourceRouteNames } from '@ioc:Adonis/Core/Route';
import { Route } from './Route';
/**
 * Resource route helps in defining multiple conventional routes. The support
 * for shallow routes makes it super easy to avoid deeply nested routes.
 * Learn more http://weblog.jamisbuck.org/2007/2/5/nesting-resources.
 *
 * @example
 * ```ts
 * const resource = new RouteResource('articles', 'ArticlesController')
 * ```
 */
export declare class RouteResource extends Macroable implements RouteResourceContract {
    private resource;
    private controller;
    private globalMatchers;
    private shallow;
    protected static macros: {};
    protected static getters: {};
    /**
     * A copy of routes that belongs to this resource
     */
    routes: Route[];
    /**
     * Resource name
     */
    private resourceName;
    constructor(resource: string, controller: string, globalMatchers: RouteMatchers, shallow?: boolean);
    /**
     * Add a new route for the given pattern, methods and controller action
     */
    private makeRoute;
    /**
     * Build routes for the given resource
     */
    private buildRoutes;
    /**
     * Filter the routes based on their partial names
     */
    private filter;
    /**
     * Register only given routes and remove others
     */
    only(names: ResourceRouteNames[]): this;
    /**
     * Register all routes, except the one's defined
     */
    except(names: ResourceRouteNames[]): this;
    /**
     * Register api only routes. The `create` and `edit` routes, which
     * are meant to show forms will not be registered
     */
    apiOnly(): this;
    /**
     * Add middleware to routes inside the resource
     */
    middleware(middleware: {
        [P in ResourceRouteNames]?: MiddlewareHandler | MiddlewareHandler[];
    } & {
        '*'?: MiddlewareHandler | MiddlewareHandler[];
    }): this;
    /**
     * Define matcher for params inside the resource
     */
    where(key: string, matcher: string | RegExp): this;
    /**
     * Define namespace for all the routes inside a given resource
     */
    namespace(namespace: string): this;
    /**
     * Prepend name to the routes names
     */
    as(name: string): this;
}
