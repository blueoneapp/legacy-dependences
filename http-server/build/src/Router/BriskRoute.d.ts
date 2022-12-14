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
import { Route } from './Route';
import { BriskRouteContract, RouteMatchers, RouteHandler } from '@ioc:Adonis/Core/Route';
/**
 * Brisk route enables you to expose expressive API for
 * defining route handler.
 *
 * For example: AdonisJs uses [[BriskRoute]] `Route.on().render()`
 * to render a view without defining a controller method or
 * closure.
 */
export declare class BriskRoute extends Macroable implements BriskRouteContract {
    private pattern;
    private globalMatchers;
    protected static macros: {};
    protected static getters: {};
    /**
     * Invoked by is reference to the parent method that calls `setHandler` on
     * this class. We keep a reference to the parent method name for raising
     * meaningful exception
     */
    private invokedBy;
    /**
     * Reference to route instance. Set after `setHandler` is called
     */
    route: null | Route;
    constructor(pattern: string, globalMatchers: RouteMatchers);
    /**
     * Set handler for the brisk route. The `invokedBy` string is the reference
     * to the method that calls this method. It is required to create human
     * readable error message when `setHandler` is called for multiple
     * times.
     */
    setHandler(handler: RouteHandler, invokedBy: string, methods?: string[]): Route;
}
