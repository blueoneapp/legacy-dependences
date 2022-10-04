/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference path="../../adonis-typings/route.d.ts" />
import { EncryptionContract } from '@ioc:Adonis/Core/Encryption';
import { RouteNode, RouteHandler, MatchedRoute, RouterContract, MakeUrlOptions, RouteLookupNode, MakeSignedUrlOptions } from '@ioc:Adonis/Core/Route';
import { Route } from './Route';
import { RouteGroup } from './Group';
import { BriskRoute } from './BriskRoute';
import { RouteResource } from './Resource';
/**
 * Router class exposes unified API to create new routes, group them or
 * create route resources.
 *
 * @example
 * ```ts
 * const router = new Router()
 *
 * router.get('/', async function () {
 *   // handle request
 * })
 * ```
 */
export declare class Router implements RouterContract {
    private encryption;
    private routeProcessor?;
    /**
     * Collection of routes, including route resource and route
     * group. To get a flat list of routes, call `router.toJSON()`
     */
    routes: (Route | RouteResource | RouteGroup | BriskRoute)[];
    /**
     * Exposing BriskRoute, RouteGroup and RouteResource constructors
     * to be extended from outside
     */
    BriskRoute: typeof BriskRoute;
    RouteGroup: typeof RouteGroup;
    RouteResource: typeof RouteResource;
    Route: typeof Route;
    /**
     * Global matchers to test route params against regular expressions.
     */
    private matchers;
    /**
     * Store with tokenized routes
     */
    private store;
    /**
     * Lookup store to find route by it's name, handler or pattern
     * and then form a complete URL from it
     */
    private lookupStore;
    /**
     * A boolean to tell the router that a group is in
     * open state right now
     */
    private openedGroups;
    /**
     * A counter to create unique routes during tests
     */
    private testRoutePatternCounter;
    private getRecentGroup;
    /**
     * A handler to handle routes created for testing
     */
    private testsHandler;
    constructor(encryption: EncryptionContract, routeProcessor?: ((route: RouteNode) => void) | undefined);
    /**
     * Add route for a given pattern and methods
     */
    route(pattern: string, methods: string[], handler: RouteHandler): Route;
    /**
     * Define a route that handles all common HTTP methods
     */
    any(pattern: string, handler: RouteHandler): Route;
    /**
     * Define `GET` route
     */
    get(pattern: string, handler: RouteHandler): Route;
    /**
     * Define `POST` route
     */
    post(pattern: string, handler: RouteHandler): Route;
    /**
     * Define `PUT` route
     */
    put(pattern: string, handler: RouteHandler): Route;
    /**
     * Define `PATCH` route
     */
    patch(pattern: string, handler: RouteHandler): Route;
    /**
     * Define `DELETE` route
     */
    delete(pattern: string, handler: RouteHandler): Route;
    /**
     * Creates a group of routes. A route group can apply transforms
     * to routes in bulk
     */
    group(callback: () => void): RouteGroup;
    /**
     * Registers a route resource with conventional set of routes
     */
    resource(resource: string, controller: string): RouteResource;
    /**
     * Register a route resource with shallow nested routes.
     */
    shallowResource(resource: string, controller: string): RouteResource;
    /**
     * Returns a brisk route instance for a given URL pattern
     */
    on(pattern: string): BriskRoute;
    /**
     * Define global route matcher
     */
    where(param: string, matcher: string | RegExp): this;
    /**
     * Returns a flat list of routes JSON
     */
    toJSON(): import("@ioc:Adonis/Core/Route").RouteJSON[];
    /**
     * Commit routes to the store. After this, no more
     * routes can be registered.
     */
    commit(): void;
    /**
     * Find route for a given URL, method and optionally domain
     */
    match(url: string, method: string, domain?: string): null | MatchedRoute;
    /**
     * Look route for a given `pattern`, `route handler` or `route name`. Later this
     * info can be used to make url for a given route.
     */
    lookup(routeIdentifier: string, forDomain?: string): null | RouteLookupNode;
    /**
     * Makes url to a registered route by looking it up with the route pattern,
     * name or the controller.method
     */
    makeUrl(routeIdentifier: string, options?: MakeUrlOptions, domain?: string): string | null;
    /**
     * Makes a signed url, which can be confirmed for it's integrity without
     * relying on any sort of backend storage.
     */
    makeSignedUrl(routeIdentifier: string, options?: MakeSignedUrlOptions, domain?: string): string | null;
    /**
     * Creates a route when writing tests and auto-commits it to the
     * routes store. Do not use this method inside your routes file.
     *
     * The global matchers doesn't work for testing routes and hence you have
     * define inline matchers (if required). Also testing routes should be
     * created to test the route functionality, they should be created to
     * test middleware or validators by hitting a route from outside in.
     */
    forTesting(pattern?: string, methods?: string[], handler?: RouteHandler): Route;
}
