/// <reference types="node" />
import { Server as HttpsServer } from 'https';
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { IncomingMessage, ServerResponse, Server } from 'http';
import { Bootstrapper } from '../Bootstrapper';
declare type ServerHandler = (req: IncomingMessage, res: ServerResponse) => any;
declare type CustomServerCallback = (handler: ServerHandler) => Server | HttpsServer;
/**
 * Exposes the API to setup the application for starting the HTTP
 * server.
 */
export declare class HttpServer {
    private appRoot;
    /**
     * Reference to bootstrapper
     */
    private bootstrapper;
    /**
     * Reference to core http server.
     */
    private server;
    /**
     * Reference to core logger
     */
    private logger;
    /**
     * Whether or not the application has been wired.
     */
    private wired;
    /**
     * Listens for unix signals to kill long running
     * processes.
     */
    private signalsListener;
    /**
     * Reference to the application.
     */
    application: ApplicationContract;
    constructor(appRoot: string);
    /**
     * Wires up everything, so that we are ready to kick start
     * the HTTP server.
     */
    private wire;
    /**
     * Sets the logger reference
     */
    private setLogger;
    /**
     * Sets the server reference
     */
    private setServer;
    /**
     * Closes the underlying HTTP server
     */
    private closeHttpServer;
    /**
     * Monitors the HTTP server for close and error events, so that
     * we can perform a graceful shutdown
     */
    private monitorHttpServer;
    /**
     * Inject bootstrapper from outside. This is mainly done
     * when you have bootstrapped application somewhere
     * else and now want to start the HTTP server.
     */
    injectBootstrapper(boostrapper: Bootstrapper): void;
    /**
     * Creates the HTTP server to handle incoming requests. The server is just
     * created but not listening on any port.
     */
    createServer(serverCallback?: CustomServerCallback): void;
    /**
     * Starts the http server a given host and port
     */
    listen(): Promise<unknown>;
    /**
     * Start the HTTP server by wiring up the application
     */
    start(serverCallback?: CustomServerCallback): Promise<void>;
    /**
     * Prepares the application for shutdown. This method will invoke `shutdown`
     * lifecycle method on the providers and closes the `httpServer`.
     */
    close(): Promise<void>;
    /**
     * Kills the http server process by attempting to perform a graceful
     * shutdown or killing the app forcefully as waiting for configured
     * seconds.
     */
    kill(waitTimeout?: number): Promise<void>;
}
export {};
