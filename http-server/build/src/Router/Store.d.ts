/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../adonis-typings/index.d.ts" />
import { RoutesTree, MatchedRoute, RouteJSON, RouteStoreMatch } from '@ioc:Adonis/Core/Route';
/**
 * Store class is used to store a list of routes, along side with their tokens
 * to match the URL's. The used data structures to store information is tailored
 * for quick lookups.
 *
 * @example
 * ```ts
 * const store = new Store()
 *
 * store.add({
 *  pattern: 'posts/:id',
 *  handler: function onRoute () {},
 *  middleware: [],
 *  matchers: {
 *    id: '^[0-9]$+'
 *  },
 *  meta: {},
 *  methods: ['GET']
 * })
 *
 * store.match('posts/1', 'GET')
 * ```
 */
export declare class Store {
    tree: RoutesTree;
    /**
     * The [[matchDomainReal]] and [[matchDomainNoop]] functions are two
     * implementation of matching a domain. We use noop implementation
     * by default and once an explicit domain is registered, we
     * pivot to [[matchDomainReal]].
     *
     * This all is done for performance, since we have noticed around 8-10%
     * improvement.
     */
    private matchDomainReal;
    private matchDomainNoop;
    /**
     * The implementation used for matching domain. Will pivot to `matchDomainReal`
     * when one or more domains will be defined
     */
    matchDomain: any;
    /**
     * Returns the domain node for a given domain. If domain node is missing,
     * it will added to the routes object and tokens are also generated
     */
    private getDomainNode;
    /**
     * Returns the method node for a given domain and method. If method is
     * missing, it will be added to the domain node
     */
    private getMethodRoutes;
    /**
     * Adds a route to the store for all the given HTTP methods. Also an array
     * of tokens is generated for the route pattern. The tokens are then
     * matched against the URL to find the appropriate route.
     *
     * @example
     * ```ts
     * store.add({
     *   pattern: 'post/:id',
     *   methods: ['GET'],
     *   matchers: {},
     *   meta: {},
     *   handler: function handler () {
     *   }
     * })
     * ```
     */
    add(route: RouteJSON): this;
    /**
     * Matches the url, method and optionally domain to pull the matching
     * route. `null` is returned when unable to match the URL against
     * registered routes.
     *
     * The domain parameter has to be a registered pattern and not the fully
     * qualified runtime domain. You must call `matchDomain` first to fetch
     * the pattern for qualified domain
     */
    match(url: string, method: string, domain?: {
        storeMatch: RouteStoreMatch[];
        value: string;
    }): null | MatchedRoute;
}
