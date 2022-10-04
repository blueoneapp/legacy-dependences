import { ApplicationContract } from '@ioc:Adonis/Core/Application';
/**
 * Exposes the API to bootstrap the application by registering-booting the
 * providers, require preloads and so on.
 */
export declare class Bootstrapper {
    private appRoot;
    touchContainerBindings: boolean;
    /**
     * Reference to the application
     */
    application: ApplicationContract;
    /**
     * Reference to registrar
     */
    private registrar;
    /**
     * Reference to the logger, will be set once providers
     * have been registered.
     */
    private logger?;
    /**
     * Providers that has ready hook function
     */
    private providersWithReadyHook;
    /**
     * Providers that has shutdown hook function
     */
    private providersWithShutdownHook;
    constructor(appRoot: string, touchContainerBindings?: boolean);
    /**
     * If package.json file defines a the engines.node property, then
     * this method will ensure that current node version satisfies
     * the defined range.
     */
    private verifyNodeJsVersion;
    /**
     * Setup the Ioc container globals and the application. This lays
     * off the ground for not having `global.use` runtime errors.
     */
    setup(): ApplicationContract;
    /**
     * Register the providers and their aliases to the IoC container.
     */
    registerProviders(includeAce: boolean): any[];
    /**
     * Registers autoloading directories
     */
    registerAliases(): void;
    /**
     * Requires preloads
     */
    registerPreloads(): void;
    /**
     * Executes the ready hooks on the providers
     */
    executeReadyHooks(): Promise<void>;
    /**
     * Executes the ready hooks on the providers
     */
    executeShutdownHooks(): Promise<void>;
    /**
     * Boot providers by invoking `boot` method on them
     */
    bootProviders(): Promise<void>;
}
