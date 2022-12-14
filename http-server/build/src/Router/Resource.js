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
exports.RouteResource = void 0;
/// <reference path="../../adonis-typings/index.ts" />
const pluralize_1 = require("pluralize");
const macroable_1 = require("macroable");
const utils_1 = require("@poppinss/utils");
const Route_1 = require("./Route");
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
class RouteResource extends macroable_1.Macroable {
    constructor(resource, controller, globalMatchers, shallow = false) {
        super();
        this.resource = resource;
        this.controller = controller;
        this.globalMatchers = globalMatchers;
        this.shallow = shallow;
        /**
         * A copy of routes that belongs to this resource
         */
        this.routes = [];
        /**
         * Resource name
         */
        this.resourceName = this.resource
            .split('.')
            .map((token) => utils_1.lodash.snakeCase(token))
            .join('.');
        this.buildRoutes();
    }
    /**
     * Add a new route for the given pattern, methods and controller action
     */
    makeRoute(pattern, methods, action) {
        const route = new Route_1.Route(pattern, methods, `${this.controller}.${action}`, this.globalMatchers);
        route.as(`${this.resourceName}.${action}`);
        this.routes.push(route);
    }
    /**
     * Build routes for the given resource
     */
    buildRoutes() {
        this.resource = this.resource.replace(/^\//, '').replace(/\/$/, '');
        const resourceTokens = this.resource.split('.');
        const mainResource = resourceTokens.pop();
        const fullUrl = `${resourceTokens
            .map((token) => `${token}/:${utils_1.lodash.snakeCase(pluralize_1.singular(token))}_id`)
            .join('/')}/${mainResource}`;
        this.makeRoute(fullUrl, ['GET'], 'index');
        this.makeRoute(`${fullUrl}/create`, ['GET'], 'create');
        this.makeRoute(fullUrl, ['POST'], 'store');
        this.makeRoute(`${this.shallow ? mainResource : fullUrl}/:id`, ['GET'], 'show');
        this.makeRoute(`${this.shallow ? mainResource : fullUrl}/:id/edit`, ['GET'], 'edit');
        this.makeRoute(`${this.shallow ? mainResource : fullUrl}/:id`, ['PUT', 'PATCH'], 'update');
        this.makeRoute(`${this.shallow ? mainResource : fullUrl}/:id`, ['DELETE'], 'destroy');
    }
    /**
     * Filter the routes based on their partial names
     */
    filter(names, inverse) {
        return this.routes.filter((route) => {
            const match = names.find((name) => route.name.endsWith(name));
            return inverse ? !match : match;
        });
    }
    /**
     * Register only given routes and remove others
     */
    only(names) {
        this.filter(names, true).forEach((route) => (route.deleted = true));
        return this;
    }
    /**
     * Register all routes, except the one's defined
     */
    except(names) {
        this.filter(names, false).forEach((route) => (route.deleted = true));
        return this;
    }
    /**
     * Register api only routes. The `create` and `edit` routes, which
     * are meant to show forms will not be registered
     */
    apiOnly() {
        return this.except(['create', 'edit']);
    }
    /**
     * Add middleware to routes inside the resource
     */
    middleware(middleware) {
        for (let name in middleware) {
            if (name === '*') {
                this.routes.forEach((one) => one.middleware(middleware[name]));
            }
            else {
                const route = this.routes.find((one) => one.name.endsWith(name));
                /* istanbul ignore else */
                if (route) {
                    route.middleware(middleware[name]);
                }
            }
        }
        return this;
    }
    /**
     * Define matcher for params inside the resource
     */
    where(key, matcher) {
        this.routes.forEach((route) => {
            route.where(key, matcher);
        });
        return this;
    }
    /**
     * Define namespace for all the routes inside a given resource
     */
    namespace(namespace) {
        this.routes.forEach((route) => {
            route.namespace(namespace);
        });
        return this;
    }
    /**
     * Prepend name to the routes names
     */
    as(name) {
        name = utils_1.lodash.snakeCase(name);
        this.routes.forEach((route) => {
            route.as(route.name.replace(this.resourceName, name), false);
        });
        this.resourceName = name;
        return this;
    }
}
exports.RouteResource = RouteResource;
RouteResource.macros = {};
RouteResource.getters = {};
