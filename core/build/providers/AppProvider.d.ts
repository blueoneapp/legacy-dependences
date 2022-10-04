import { IocContract } from '@adonisjs/fold';
/**
 * The application provider that sticks all core components
 * to the container.
 */
export default class AppProvider {
    protected container: IocContract;
    constructor(container: IocContract);
    /**
     * Additional providers to load
     */
    provides: string[];
    /**
     * Register `HttpExceptionHandler` to the container.
     */
    protected registerHttpExceptionHandler(): void;
    /**
     * Registering the health check provider
     */
    protected registerHealthCheck(): void;
    /**
     * Lazy initialize the cors hook, if enabled inside the config
     */
    protected registerCorsHook(): void;
    /**
     * Lazy initialize the static assets hook, if enabled inside the config
     */
    protected registerStaticAssetsHook(): void;
    /**
     * Registers base health checkers
     */
    protected registerHealthCheckers(): void;
    /**
     * Registering all required bindings to the container
     */
    register(): void;
    /**
     * Register hooks and health checkers on boot
     */
    boot(): void;
}
