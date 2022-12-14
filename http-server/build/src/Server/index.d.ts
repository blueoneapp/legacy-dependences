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
import { IocContract } from '@adonisjs/fold';
import { Server as HttpsServer } from 'https';
import { LoggerContract } from '@ioc:Adonis/Core/Logger';
import { EncryptionContract } from '@ioc:Adonis/Core/Encryption';
import { IncomingMessage, ServerResponse, Server as HttpServer } from 'http';
import { ProfilerContract } from '@ioc:Adonis/Core/Profiler';
import { ServerContract, ServerConfig, ErrorHandler } from '@ioc:Adonis/Core/Server';
import { Hooks } from './Hooks';
import { Router } from '../Router';
import { MiddlewareStore } from '../MiddlewareStore';
/**
 * Server class handles the HTTP requests by using all Adonis micro modules.
 */
export declare class Server implements ServerContract {
    private container;
    private logger;
    private profiler;
    private encryption;
    private httpConfig;
    /**
     * The server itself doesn't create the http server instance. However, the consumer
     * of this class can create one and set the instance for further reference. This
     * is what ignitor does.
     */
    instance?: HttpServer | HttpsServer;
    /**
     * The middleware store to register global and named middleware
     */
    middleware: MiddlewareStore;
    /**
     * The route to register routes
     */
    router: Router;
    /**
     * Server before/after hooks
     */
    hooks: Hooks;
    /**
     * Precompiler to set the finalHandler for the route
     */
    private precompiler;
    /**
     * Exception manager to handle exceptions
     */
    private exception;
    /**
     * Request handler to handle request after route is found
     */
    private requestHandler;
    constructor(container: IocContract, logger: LoggerContract, profiler: ProfilerContract, encryption: EncryptionContract, httpConfig: ServerConfig);
    /**
     * Handles HTTP request
     */
    private handleRequest;
    /**
     * Returns the profiler row
     */
    private getProfilerRow;
    /**
     * Returns the context for the request
     */
    private getContext;
    /**
     * Define custom error handler to handler all errors
     * occurred during HTTP request
     */
    errorHandler(handler: ErrorHandler): this;
    /**
     * Optimizes internal handlers, based upon the existence of
     * before handlers and global middleware. This helps in
     * increasing throughput by 10%
     */
    optimize(): void;
    /**
     * Handles a given HTTP request. This method can be attached to any HTTP
     * server
     */
    handle(req: IncomingMessage, res: ServerResponse): Promise<void>;
}
