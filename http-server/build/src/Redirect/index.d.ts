/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference types="node" />
import { IncomingMessage } from 'http';
import { RouterContract, MakeUrlOptions } from '@ioc:Adonis/Core/Route';
import { RedirectContract, ResponseContract } from '@ioc:Adonis/Core/Response';
/**
 * Exposes the API to construct redirect routes
 */
export declare class Redirect implements RedirectContract {
    private request;
    private response;
    private router;
    /**
     * A boolean to forward the existing query string
     */
    private forwardQueryString;
    /**
     * The status code for the redirect
     */
    private statusCode;
    /**
     * A custom query string to forward
     */
    private queryString;
    constructor(request: IncomingMessage, response: ResponseContract, router: RouterContract);
    /**
     * Set a custom status code.
     */
    status(statusCode: number): this;
    /**
     * Forward the current QueryString or define one.
     */
    withQs(): this;
    withQs(values: {
        [key: string]: any;
    }): this;
    withQs(name: string, value: any): this;
    /**
     * Redirect to the previous path.
     */
    back(): void;
    /**
     * Redirect the request using a route identifier.
     */
    toRoute(routeIdentifier: string, urlOptions?: MakeUrlOptions, domain?: string): void;
    /**
     * Redirect the request using a path.
     */
    toPath(url: string): void;
}
