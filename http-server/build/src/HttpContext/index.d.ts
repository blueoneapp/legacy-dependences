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
import { Macroable } from 'macroable';
import { RouteNode, RouterContract } from '@ioc:Adonis/Core/Route';
import { ServerConfig } from '@ioc:Adonis/Core/Server';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggerContract } from '@ioc:Adonis/Core/Logger';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import { ResponseContract } from '@ioc:Adonis/Core/Response';
import { ProfilerRowContract } from '@ioc:Adonis/Core/Profiler';
import { EncryptionContract } from '@ioc:Adonis/Core/Encryption';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
/**
 * Http context is passed to all route handlers, middleware,
 * error handler and server hooks.
 */
export declare class HttpContext extends Macroable implements HttpContextContract {
    request: RequestContract;
    response: ResponseContract;
    logger: LoggerContract;
    profiler: ProfilerRowContract;
    routeKey: string;
    params: any;
    subdomains: any;
    route?: RouteNode;
    /**
     * Required by macroable
     */
    protected static macros: {};
    protected static getters: {};
    constructor(request: RequestContract, response: ResponseContract, logger: LoggerContract, profiler: ProfilerRowContract);
    /**
     * A helper to see top level properties on the context object
     */
    inspect(): string;
    /**
     * Creates a new fake context instance for a given route.
     */
    static create(routePattern: string, routeParams: any, logger: LoggerContract, profiler: ProfilerRowContract, encryption: EncryptionContract, router: RouterContract, req?: IncomingMessage, res?: ServerResponse, serverConfig?: ServerConfig): HttpContext;
}
