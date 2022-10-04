"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bootstrapper = void 0;
const path_1 = require("path");
const semver_1 = __importDefault(require("semver"));
const find_package_json_1 = __importDefault(require("find-package-json"));
const utils_1 = require("@poppinss/utils");
const fold_1 = require("@adonisjs/fold");
const standalone_1 = require("@adonisjs/application/build/standalone");
const utils_2 = require("../../utils");
/**
 * Exposes the API to bootstrap the application by registering-booting the
 * providers, require preloads and so on.
 */
class Bootstrapper {
    constructor(appRoot, touchContainerBindings = false) {
        this.appRoot = appRoot;
        this.touchContainerBindings = touchContainerBindings;
        /**
         * Providers that has ready hook function
         */
        this.providersWithReadyHook = [];
        /**
         * Providers that has shutdown hook function
         */
        this.providersWithShutdownHook = [];
    }
    /**
     * If package.json file defines a the engines.node property, then
     * this method will ensure that current node version satisfies
     * the defined range.
     */
    verifyNodeJsVersion(pkgFile) {
        var _a;
        const nodeEngine = (_a = pkgFile === null || pkgFile === void 0 ? void 0 : pkgFile.engines) === null || _a === void 0 ? void 0 : _a.node;
        if (!nodeEngine) {
            return;
        }
        if (!semver_1.default.satisfies(process.version, nodeEngine)) {
            throw new Error(`The installed Node.js version "${process.version}" does not satisfies the expected version "${nodeEngine}" defined inside package.json file`);
        }
    }
    /**
     * Setup the Ioc container globals and the application. This lays
     * off the ground for not having `global.use` runtime errors.
     */
    setup() {
        const ioc = new fold_1.Ioc();
        /**
         * Adding IoC container resolver methods to the globals.
         */
        global[Symbol.for('ioc.use')] = ioc.use.bind(ioc);
        global[Symbol.for('ioc.make')] = ioc.make.bind(ioc);
        global[Symbol.for('ioc.call')] = ioc.call.bind(ioc);
        const adonisCorePkgFile = find_package_json_1.default(path_1.join(__dirname, '..', '..')).next().value;
        const appPkgFile = find_package_json_1.default(this.appRoot).next().value;
        const pkgFile = {
            name: appPkgFile ? appPkgFile.name : 'adonis',
            version: appPkgFile ? appPkgFile.version : '0.0.0',
            adonisVersion: adonisCorePkgFile.version,
        };
        /**
         * Loading `.adonisrc.json` file with custom error handling when
         * the file is missing
         */
        let rcContents = {};
        try {
            rcContents = utils_1.esmRequire(path_1.join(this.appRoot, '.adonisrc.json'));
        }
        catch (error) {
            if (utils_2.isMissingModuleError(error)) {
                throw new Error('Make sure the project root has ".adonisrc.json"');
            }
            throw error;
        }
        /**
         * Setting up the application and binding it to the container as well. This makes
         * it's way to the container even before the providers starts registering
         * themselves.
         */
        this.application = new standalone_1.Application(this.appRoot, ioc, rcContents, pkgFile);
        this.registrar = new fold_1.Registrar(ioc, this.appRoot);
        this.verifyNodeJsVersion(appPkgFile);
        ioc.singleton('Adonis/Core/Application', () => this.application);
        return this.application;
    }
    /**
     * Register the providers and their aliases to the IoC container.
     */
    registerProviders(includeAce) {
        const providers = includeAce
            ? this.application.rcFile.providers.concat(this.application.rcFile.aceProviders)
            : this.application.rcFile.providers;
        const providersList = providers.filter((provider) => !!provider);
        const providersRefs = this.registrar.useProviders(providersList).register();
        /**
         * Storing a reference of providers that has ready and exit hooks
         */
        providersRefs.forEach((provider) => {
            if (typeof provider.ready === 'function') {
                this.providersWithReadyHook.push(provider);
            }
            if (typeof provider.shutdown === 'function') {
                this.providersWithShutdownHook.push(provider);
            }
        });
        if (this.touchContainerBindings) {
            this.logger = this.application.container.use('Adonis/Core/Logger');
        }
        return providersRefs;
    }
    /**
     * Registers autoloading directories
     */
    registerAliases() {
        this.application.aliasesMap.forEach((toPath, alias) => {
            if (this.logger) {
                this.logger.trace('registering %s under %s alias', toPath, alias);
            }
            this.application.container.autoload(path_1.join(this.application.appRoot, toPath), alias);
        });
    }
    /**
     * Requires preloads
     */
    registerPreloads() {
        this.application.preloads
            .filter((node) => {
            if (!node.environment || this.application.environment === 'unknown') {
                return true;
            }
            return node.environment.indexOf(this.application.environment) > -1;
        })
            .forEach((node) => {
            if (this.logger) {
                this.logger.trace('preloading %s file', node.file);
            }
            utils_2.optionalResolveAndRequire(node.file, this.application.appRoot, node.optional);
        });
    }
    /**
     * Executes the ready hooks on the providers
     */
    async executeReadyHooks() {
        if (this.logger) {
            this.logger.trace('executing ready hooks');
        }
        await Promise.all(this.providersWithReadyHook.map((provider) => provider.ready()));
        this.providersWithReadyHook = [];
    }
    /**
     * Executes the ready hooks on the providers
     */
    async executeShutdownHooks() {
        if (this.logger) {
            this.logger.trace('executing shutdown hooks');
        }
        await Promise.all(this.providersWithShutdownHook.map((provider) => provider.shutdown()));
        this.providersWithShutdownHook = [];
    }
    /**
     * Boot providers by invoking `boot` method on them
     */
    async bootProviders() {
        if (this.logger) {
            this.logger.trace('booting providers');
        }
        await this.registrar.boot();
    }
}
exports.Bootstrapper = Bootstrapper;
