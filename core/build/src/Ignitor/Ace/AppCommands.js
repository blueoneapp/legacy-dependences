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
exports.AppCommands = void 0;
const fs_1 = require("fs");
const Bootstrapper_1 = require("../Bootstrapper");
const SignalsListener_1 = require("../SignalsListener");
const AceRuntimeException_1 = require("./AceRuntimeException");
/**
 * Exposes the API to execute app commands registered under
 * the manifest file.
 */
class AppCommands {
    /**
     * Source root always points to the compiled source
     * code.
     */
    constructor(buildRoot, ace, additionalManifestCommands) {
        this.buildRoot = buildRoot;
        this.ace = ace;
        this.additionalManifestCommands = additionalManifestCommands;
        this.bootstrapper = new Bootstrapper_1.Bootstrapper(this.buildRoot, true);
        /**
         * Whether or not the app was wired. App is only wired, when
         * loadApp inside the command setting is true.
         */
        this.wired = false;
        /**
         * Signals listener to listen for exit signals and kill command
         */
        this.signalsListener = new SignalsListener_1.SignalsListener();
    }
    /**
     * Print commands help
     */
    printHelp(kernel, command) {
        /**
         * Updating manifest commands object during help
         */
        Object.keys(this.additionalManifestCommands).forEach((commandName) => {
            kernel.manifestCommands[commandName] = this.additionalManifestCommands[commandName];
        });
        kernel.printHelp(command);
        process.exit(0);
    }
    /**
     * Raises human friendly error when the `build` directory is
     * missing during `generate:manifest` command.
     */
    ensureBuildRoot(command) {
        command = command || '<command>';
        return new Promise((resolve, reject) => {
            fs_1.exists(this.buildRoot, (hasFile) => {
                if (!hasFile) {
                    reject(new AceRuntimeException_1.AceRuntimeException(`Make sure to compile the code before running "node ace ${command}"`));
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Hooks into kernel lifecycle events to conditionally
     * load the app.
     */
    addKernelHooks(kernel) {
        kernel.before('find', async (command) => {
            /**
             * Since commands can internally execute other commands. We should not re-wire
             * the application when this hook is invoked for more than one command inside
             * a single process.
             */
            if (command && command.settings.loadApp && !this.wired) {
                await this.wire();
                this.bootstrapper.application.isReady = true;
            }
        });
        kernel.before('run', async () => {
            if (this.wired) {
                await this.bootstrapper.executeReadyHooks();
            }
        });
    }
    /**
     * Adding flags
     */
    addKernelFlags(kernel) {
        /**
         * Showing help including core commands
         */
        kernel.flag('help', async (value, _, command) => {
            if (!value) {
                return;
            }
            this.printHelp(kernel, command);
        }, { alias: 'h' });
        /**
         * Showing app and AdonisJs version
         */
        kernel.flag('version', async (value) => {
            if (!value) {
                return;
            }
            const appVersion = this.bootstrapper.application.version;
            const adonisVersion = this.bootstrapper.application.adonisVersion;
            console.log('App version', appVersion ? appVersion.version : 'NA');
            console.log('Framework version', adonisVersion ? adonisVersion.version : 'NA');
            process.exit(0);
        }, { alias: 'v' });
    }
    /**
     * Boot the application.
     */
    async wire() {
        if (this.wired) {
            return;
        }
        this.wired = true;
        /**
         * Do not change sequence
         */
        this.bootstrapper.registerAliases();
        this.bootstrapper.registerProviders(true);
        await this.bootstrapper.bootProviders();
        this.bootstrapper.registerPreloads();
    }
    /**
     * Handle application command
     */
    async handle(argv) {
        await this.ensureBuildRoot(argv[0]);
        this.bootstrapper.setup();
        this.bootstrapper.application.environment = 'console';
        const manifest = new this.ace.Manifest(this.buildRoot);
        const kernel = new this.ace.Kernel(this.bootstrapper.application);
        this.addKernelHooks(kernel);
        this.addKernelFlags(kernel);
        kernel.useManifest(manifest);
        await kernel.preloadManifest();
        /**
         * Print help when no arguments have been passed
         */
        if (!argv.length) {
            this.printHelp(kernel);
        }
        await kernel.handle(argv);
        this.signalsListener.listen(async () => {
            if (this.wired) {
                await this.bootstrapper.executeShutdownHooks();
            }
        });
    }
}
exports.AppCommands = AppCommands;
