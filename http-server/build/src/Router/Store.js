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
exports.Store = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const matchit_1 = __importDefault(require("matchit"));
const utils_1 = require("@poppinss/utils");
const RouterException_1 = require("../Exceptions/RouterException");
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
class Store {
    constructor() {
        this.tree = { tokens: [], domains: {} };
        /**
         * The [[matchDomainReal]] and [[matchDomainNoop]] functions are two
         * implementation of matching a domain. We use noop implementation
         * by default and once an explicit domain is registered, we
         * pivot to [[matchDomainReal]].
         *
         * This all is done for performance, since we have noticed around 8-10%
         * improvement.
         */
        this.matchDomainReal = function (domain) {
            return matchit_1.default.match(domain || 'root', this.tree.tokens);
        }.bind(this);
        this.matchDomainNoop = function (_) {
            return [];
        }.bind(this);
        /**
         * The implementation used for matching domain. Will pivot to `matchDomainReal`
         * when one or more domains will be defined
         */
        this.matchDomain = this.matchDomainNoop;
    }
    /**
     * Returns the domain node for a given domain. If domain node is missing,
     * it will added to the routes object and tokens are also generated
     */
    getDomainNode(domain) {
        if (!this.tree.domains[domain]) {
            /**
             * The tokens are required to match dynamic domains
             */
            this.tree.tokens.push(matchit_1.default.parse(domain));
            this.tree.domains[domain] = {};
        }
        return this.tree.domains[domain];
    }
    /**
     * Returns the method node for a given domain and method. If method is
     * missing, it will be added to the domain node
     */
    getMethodRoutes(domain, method) {
        const domainNode = this.getDomainNode(domain);
        if (!domainNode[method]) {
            domainNode[method] = { tokens: [], routes: {} };
        }
        return domainNode[method];
    }
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
    add(route) {
        /*
         * Create a copy of route properties by cherry picking
         * fields. We create the copy outside the forEach
         * loop, so that the same object is shared across
         * all the methods (saving memory).
         *
         * Also sharing a single route note among all the methods is fine,
         * since we create sub-trees for each method to make the lookups
         * fast.
         */
        const routeJSON = {};
        utils_1.lodash.merge(routeJSON, utils_1.lodash.pick(route, ['pattern', 'handler', 'meta', 'middleware', 'name']));
        /*
         * An explicit domain is defined
         */
        if (route.domain && route.domain !== 'root' && this.matchDomain !== this.matchDomainReal) {
            this.matchDomain = this.matchDomainReal;
        }
        /*
         * Generate tokens for the given route and push to the list
         * of tokens
         */
        const tokens = matchit_1.default.parse(route.pattern, route.matchers);
        const collectedParams = new Set();
        /**
         * Avoiding duplicate route params
         */
        for (let token of tokens) {
            if ([1, 3].includes(token.type)) {
                if (collectedParams.has(token.val)) {
                    throw RouterException_1.RouterException.duplicateRouteParam(token.val, route.pattern);
                }
                else {
                    collectedParams.add(token.val);
                }
            }
        }
        collectedParams.clear();
        route.methods.forEach((method) => {
            const methodRoutes = this.getMethodRoutes(route.domain || 'root', method);
            /*
             * Ensure that route doesn't pre-exists. In that case, we need to throw
             * the exception, since it's a programmer error to create multiple
             * routes with the same pattern on the same method.
             */
            if (methodRoutes.routes[route.pattern]) {
                throw RouterException_1.RouterException.duplicateRoute(method, route.pattern);
            }
            methodRoutes.tokens.push(tokens);
            /*
             * Store reference to the route, so that we can return it to the user, when
             * they call `match`.
             */
            methodRoutes.routes[route.pattern] = routeJSON;
        });
        return this;
    }
    /**
     * Matches the url, method and optionally domain to pull the matching
     * route. `null` is returned when unable to match the URL against
     * registered routes.
     *
     * The domain parameter has to be a registered pattern and not the fully
     * qualified runtime domain. You must call `matchDomain` first to fetch
     * the pattern for qualified domain
     */
    match(url, method, domain) {
        const matchingDomain = domain && domain.storeMatch[0] && domain.storeMatch[0].old;
        const domainName = matchingDomain || 'root';
        const matchedDomain = this.tree.domains[domainName];
        if (!matchedDomain) {
            return null;
        }
        /*
         * Next get the method node for the given method inside the domain. If
         * method node is missing, means no routes ever got registered for that
         * method
         */
        const matchedMethod = this.tree.domains[domainName][method];
        if (!matchedMethod) {
            return null;
        }
        /*
         * Next, match route for the given url inside the tokens list for the
         * matchedMethod
         */
        const matchedRoute = matchit_1.default.match(url, matchedMethod.tokens);
        if (!matchedRoute.length) {
            return null;
        }
        const route = matchedMethod.routes[matchedRoute[0].old];
        return {
            route: route,
            routeKey: matchingDomain
                ? `${matchingDomain}-${method}-${route.pattern}`
                : `${method}-${route.pattern}`,
            params: matchit_1.default.exec(url, matchedRoute),
            subdomains: (domain === null || domain === void 0 ? void 0 : domain.value) ? matchit_1.default.exec(domain.value, domain.storeMatch) : {},
        };
    }
}
exports.Store = Store;
