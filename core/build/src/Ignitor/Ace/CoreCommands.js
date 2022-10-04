"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreCommands = void 0;
const path_1 = require("path");
const fold_1 = require("@adonisjs/fold");
const utils_1 = require("@poppinss/utils");
const standalone_1 = require("@adonisjs/application/build/standalone");
const utils_2 = require("../../utils");
const AceRuntimeException_1 = require("./AceRuntimeException");
/**
 * Exposes the API to run core commands from `@adonisjs/assembler`.
 */
class CoreCommands {
    constructor(appRoot, ace) {
        this.appRoot = appRoot;
        this.ace = ace;
    }
    /**
     * Returns assembler manifest file for showing help
     */
    static getManifestJSON() {
        try {
            return require('@adonisjs/assembler/build/ace-manifest.json');
        }
        catch (error) {
            return {};
        }
    }
    /**
     * Loading `.adonisrc.json` file with custom error handling when the file
     * is missing. With ace commands we always use `RuntimeException`, since
     * we handle it in a different way to show console friendly one liner
     * errors.
     */
    setupApplication() {
        let rcContents = {};
        try {
            rcContents = utils_1.esmRequire(path_1.join(this.appRoot, '.adonisrc.json'));
        }
        catch (error) {
            if (utils_2.isMissingModuleError(error)) {
                throw new AceRuntimeException_1.AceRuntimeException('Make sure the project root has ".adonisrc.json"');
            }
            throw error;
        }
        this.application = new standalone_1.Application(this.appRoot, new fold_1.Ioc(), rcContents, {});
        this.application.environment = 'console';
    }
    /**
     * Lazy load @adonisjs/assembler
     */
    async importAssembler(command) {
        try {
            return await Promise.resolve().then(() => __importStar(require('@adonisjs/assembler/build/src/EnvParser/index')));
        }
        catch (error) {
            if (utils_2.isMissingModuleError(error)) {
                throw new AceRuntimeException_1.AceRuntimeException(`Install "@adonisjs/assembler" to execute "${command}" command`);
            }
            throw error;
        }
    }
    /**
     * Handle core commands
     */
    async handle(argv) {
        this.setupApplication();
        await this.importAssembler(argv[0]);
        const manifest = new this.ace.Manifest(path_1.dirname(utils_1.resolveFrom(this.appRoot, '@adonisjs/assembler')));
        const kernel = new this.ace.Kernel(this.application);
        /**
         * Showing commands help
         */
        kernel.flag('help', async (value, _, command) => {
            if (!value) {
                return;
            }
            kernel.printHelp(command);
            process.exit(0);
        }, { alias: 'h' });
        kernel.useManifest(manifest);
        await kernel.handle(argv);
    }
}
exports.CoreCommands = CoreCommands;
/**
 * List of core commands
 */
CoreCommands.commandsList = Object.keys(CoreCommands.getManifestJSON());
/**
 * A local list of assembler commands. We need this, so that when assembler
 * is not installed (probably in production) and someone is trying to
 * build the project by running `serve` or `build`, we should give
 * them a better descriptive error.
 *
 * Also, do note that at times this list will be stale, but we get it back
 * in sync over time.
 */
CoreCommands.localCommandsList = [
    'build',
    'serve',
    'invoke',
    'make:command',
    'make:controller',
    'make:middleware',
    'make:provider',
    'make:validator',
    'make:view',
    'make:prldfile',
];
