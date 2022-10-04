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
exports.Ace = void 0;
const path_1 = require("path");
const AppCommands_1 = require("./AppCommands");
const CoreCommands_1 = require("./CoreCommands");
const utils_1 = require("../../utils");
const GenerateManifest_1 = require("./GenerateManifest");
const AceRuntimeException_1 = require("./AceRuntimeException");
const RC_FILE_NAME = '.adonisrc.json';
const TS_CONFIG_FILE = 'tsconfig.json';
/**
 * Exposes the API to execute ace commands.
 */
class Ace {
    constructor(appRoot) {
        this.appRoot = appRoot;
        /**
         * This environment variable helps runtime to find the actual
         * source directory
         */
        process.env.ADONIS_ACE_CWD = this.appRoot;
    }
    /**
     * Lazy load ace
     */
    async importAce() {
        try {
            return await Promise.resolve().then(() => __importStar(require('@adonisjs/ace')));
        }
        catch (error) {
            if (utils_1.isMissingModuleError(error)) {
                throw new AceRuntimeException_1.AceRuntimeException('Install "@adonisjs/ace" to execute ace commands');
            }
            throw error;
        }
    }
    /**
     * Returns a boolean telling if project root has typescript
     * source code. This is done by inspecting `.adonisrc.json`
     * file.
     */
    isTsProject() {
        try {
            const rcFile = require(path_1.join(this.appRoot, RC_FILE_NAME)) || {};
            return rcFile.typescript === false ? false : true;
        }
        catch (error) {
            if (utils_1.isMissingModuleError(error)) {
                throw new AceRuntimeException_1.AceRuntimeException(`Error: Before running ace commands, ensure that project root has "${RC_FILE_NAME}" file`);
            }
            throw error;
        }
    }
    /**
     * Returns the build directory relative path. Call this when you are
     * sure that it is a valid typescript project
     */
    getBuildDir() {
        try {
            const tsConfig = require(path_1.join(this.appRoot, TS_CONFIG_FILE)) || {};
            if (!tsConfig.compilerOptions || !tsConfig.compilerOptions.outDir) {
                throw new AceRuntimeException_1.AceRuntimeException(`Make sure to define "compilerOptions.outDir" in ${TS_CONFIG_FILE} file`);
            }
            return tsConfig.compilerOptions.outDir;
        }
        catch (error) {
            if (utils_1.isMissingModuleError(error)) {
                throw new AceRuntimeException_1.AceRuntimeException(`Typescript projects must have "${TS_CONFIG_FILE}" file inside the project root`);
            }
            throw error;
        }
    }
    /**
     * Handles the ace command
     */
    async handle(argv) {
        const ace = await this.importAce();
        try {
            const isTypescript = this.isTsProject();
            /**
             * By default the current directory is the build directory. However, if
             * the application is the typescript source code, then we fetch the
             * build directory from `tsconfig.json` file.
             */
            let buildDir = this.appRoot;
            if (isTypescript) {
                process.env.ADONIS_IS_TYPESCRIPT = 'true';
                process.env.ADONIS_BUILD_DIR = this.getBuildDir();
                buildDir = path_1.join(this.appRoot, process.env.ADONIS_BUILD_DIR);
            }
            /**
             * Handle generate manifest manually
             */
            if (argv[0] === 'generate:manifest') {
                await new GenerateManifest_1.GenerateManifest(buildDir, ace).handle();
                return;
            }
            /**
             * Pass command over to core commands from `assembler`
             */
            if (CoreCommands_1.CoreCommands.commandsList.includes(argv[0])) {
                await new CoreCommands_1.CoreCommands(this.appRoot, ace).handle(argv);
                return;
            }
            /**
             * Trying to run an assembler command without installing assembler
             */
            if (CoreCommands_1.CoreCommands.commandsList.length === 0 &&
                CoreCommands_1.CoreCommands.localCommandsList.includes(argv[0])) {
                throw new AceRuntimeException_1.AceRuntimeException(`Make sure to install "@adonisjs/assembler" before running "${argv[0]}" command`);
            }
            /**
             * Passing manifest json of core commands and generate manifest, so that
             * we can append in the help output
             */
            const additionalManifestJSON = Object.assign(CoreCommands_1.CoreCommands.getManifestJSON(), GenerateManifest_1.GenerateManifest.getManifestJSON());
            /**
             * Proxy over to application commands
             */
            await new AppCommands_1.AppCommands(buildDir, ace, additionalManifestJSON).handle(argv);
        }
        catch (error) {
            ace.handleError(error, (_, logger) => {
                if (error instanceof AceRuntimeException_1.AceRuntimeException) {
                    logger.error(error.message);
                }
                else {
                    logger.fatal(error);
                }
            });
        }
    }
}
exports.Ace = Ace;
