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
exports.GenerateManifest = void 0;
const fs_1 = require("fs");
const Bootstrapper_1 = require("../Bootstrapper");
const AceRuntimeException_1 = require("./AceRuntimeException");
/**
 * Exposes the API to generate the manifest file
 */
class GenerateManifest {
    /**
     * Source root always points to the compiled source
     * code.
     */
    constructor(buildRoot, ace) {
        this.buildRoot = buildRoot;
        this.ace = ace;
        this.bootstrapper = new Bootstrapper_1.Bootstrapper(this.buildRoot, false);
    }
    /**
     * Returns manifest object for showing help
     */
    static getManifestJSON() {
        return {
            'generate:manifest': {
                commandName: 'generate:manifest',
                description: 'Generate manifest file to execute ace commands',
                args: [],
                flags: [],
                settings: {},
            },
        };
    }
    /**
     * Raises human friendly error when the `build` directory is
     * missing during `generate:manifest` command.
     */
    ensureBuildRoot() {
        return new Promise((resolve, reject) => {
            fs_1.exists(this.buildRoot, (hasFile) => {
                if (!hasFile) {
                    reject(new AceRuntimeException_1.AceRuntimeException('Make sure to compile the code before running "node ace generate:manifest"'));
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Generates the manifest file for commands
     */
    async handle() {
        await this.ensureBuildRoot();
        this.bootstrapper.setup();
        const application = this.bootstrapper.application;
        application.environment = 'console';
        const commands = application.rcFile.commands;
        /**
         * Register aliases for imports to work
         */
        this.bootstrapper.registerAliases();
        /**
         * We register providers and autoloads to avoid runtime
         * import exception when loading commands to generate
         * the manifest file
         */
        this.bootstrapper.registerProviders(true);
        /**
         * Generate file
         */
        await new this.ace.Manifest(this.buildRoot).generate(commands);
        /**
         * Success
         */
        this.ace.logger.create('ace-manifest.json');
    }
}
exports.GenerateManifest = GenerateManifest;
