import { Ace } from './Ace';
import { HttpServer } from './HttpServer';
import { Bootstrapper } from './Bootstrapper';
/**
 * Ignitor is used to wireup different pieces of AdonisJs to bootstrap
 * the application.
 */
export declare class Ignitor {
    private appRoot;
    constructor(appRoot: string);
    /**
     * Returns instance of bootstrapper to boostrap
     * the application
     */
    boostrapper(): Bootstrapper;
    /**
     * Returns instance of server to start
     * the HTTP server
     */
    httpServer(): HttpServer;
    /**
     * Returns instance of ace to handle console
     * commands
     */
    ace(): Ace;
}
