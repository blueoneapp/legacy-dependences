/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { IocContract } from '@adonisjs/fold';
export default class HttpServerProvider {
    protected container: IocContract;
    constructor(container: IocContract);
    /**
     * Register request and response bindings to the container
     */
    protected registerRequestResponse(): void;
    /**
     * Registering middleware store to the container
     */
    protected registerMiddlewareStore(): void;
    /**
     * Registering the HTTP context
     */
    protected registerHTTPContext(): void;
    /**
     * Register the HTTP server
     */
    protected registerHttpServer(): void;
    /**
     * Register the router. The router points to the instance of router used
     * by the middleware
     */
    protected registerRouter(): void;
    /**
     * Registering all bindings
     */
    register(): void;
}
