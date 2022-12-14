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
import { RouteGroupContract } from '@ioc:Adonis/Core/Route';
import { MiddlewareHandler } from '@ioc:Adonis/Core/Middleware';
import { Route } from './Route';
import { BriskRoute } from './BriskRoute';
import { RouteResource } from './Resource';
/**
 * Group class exposes the API to take action on a group of routes.
 * The group routes must be pre-defined using the constructor.
 */
export declare class RouteGroup extends Macroable implements RouteGroupContract {
    routes: (Route | RouteResource | BriskRoute | RouteGroup)[];
    protected static macros: {};
    protected static getters: {};
    constructor(routes: (Route | RouteResource | BriskRoute | RouteGroup)[]);
    /**
     * Invokes a given method with params on the route instance or route
     * resource instance
     */
    private invoke;
    /**
     * Define Regex matchers for a given param for all the routes.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).where('id', /^[0-9]+/)
     * ```
     */
    where(param: string, matcher: RegExp | string): this;
    /**
     * Define prefix all the routes in the group.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).prefix('v1')
     * ```
     */
    prefix(prefix: string): this;
    /**
     * Define domain for all the routes.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).domain(':name.adonisjs.com')
     * ```
     */
    domain(domain: string): this;
    /**
     * Prepend name to the routes name.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).as('version1')
     * ```
     */
    as(name: string): this;
    /**
     * Prepend an array of middleware to all routes middleware.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).middleware(['auth'])
     * ```
     */
    middleware(middleware: MiddlewareHandler | MiddlewareHandler[]): this;
    /**
     * Define namespace for all the routes inside the group.
     *
     * @example
     * ```ts
     * Route.group(() => {
     * }).namespace('App/Admin/Controllers')
     * ```
     */
    namespace(namespace: string): this;
}
