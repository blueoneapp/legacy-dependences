"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The application provider that sticks all core components
 * to the container.
 */
class AppProvider {
    constructor(container) {
        this.container = container;
        /**
         * Additional providers to load
         */
        this.provides = [
            '@adonisjs/env',
            '@adonisjs/config',
            '@adonisjs/profiler',
            '@adonisjs/logger',
            '@adonisjs/encryption',
            '@adonisjs/events',
            '@adonisjs/hash',
            '@adonisjs/http-server',
            '@adonisjs/bodyparser',
            '@adonisjs/validator',
        ];
    }
    /**
     * Register `HttpExceptionHandler` to the container.
     */
    registerHttpExceptionHandler() {
        this.container.bind('Adonis/Core/HttpExceptionHandler', () => {
            const { HttpExceptionHandler } = require('../src/HttpExceptionHandler');
            return HttpExceptionHandler;
        });
    }
    /**
     * Registering the health check provider
     */
    registerHealthCheck() {
        this.container.singleton('Adonis/Core/HealthCheck', () => {
            const { HealthCheck } = require('../src/HealthCheck');
            return new HealthCheck(this.container.use('Adonis/Core/Application'));
        });
    }
    /**
     * Lazy initialize the cors hook, if enabled inside the config
     */
    registerCorsHook() {
        /**
         * Register the cors before hook with the server
         */
        this.container.with(['Adonis/Core/Config', 'Adonis/Core/Server'], (Config, Server) => {
            const config = Config.get('cors', {});
            if (!config.enabled) {
                return;
            }
            const Cors = require('../src/Hooks/Cors').Cors;
            const cors = new Cors(config);
            Server.hooks.before(cors.handle.bind(cors));
        });
    }
    /**
     * Lazy initialize the static assets hook, if enabled inside the config
     */
    registerStaticAssetsHook() {
        /**
         * Register the cors before hook with the server
         */
        this.container.with(['Adonis/Core/Config', 'Adonis/Core/Server', 'Adonis/Core/Application'], (Config, Server, Application) => {
            const config = Config.get('static', {});
            if (!config.enabled) {
                return;
            }
            const ServeStatic = require('../src/Hooks/Static').ServeStatic;
            const serveStatic = new ServeStatic(Application.publicPath(), config);
            Server.hooks.before(serveStatic.handle.bind(serveStatic));
        });
    }
    /**
     * Registers base health checkers
     */
    registerHealthCheckers() {
        this.container.with(['Adonis/Core/HealthCheck'], (healthCheck) => {
            require('../src/HealthCheck/Checkers/Env').default(healthCheck);
            require('../src/HealthCheck/Checkers/AppKey').default(healthCheck);
        });
    }
    /**
     * Registering all required bindings to the container
     */
    register() {
        this.registerHttpExceptionHandler();
        this.registerHealthCheck();
    }
    /**
     * Register hooks and health checkers on boot
     */
    boot() {
        this.registerCorsHook();
        this.registerStaticAssetsHook();
        this.registerHealthCheckers();
    }
}
exports.default = AppProvider;
