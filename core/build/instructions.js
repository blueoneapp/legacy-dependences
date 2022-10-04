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
const path_1 = require("path");
const APP_TEMPLATE_STUB = path_1.join(__dirname, './templates', 'config', 'app.txt');
const STATIC_TEMPLATE_STUB = path_1.join(__dirname, './templates', 'config', 'static.txt');
async function instructions(projectRoot, _, { logger, files }) {
    const isApiBoilerplate = process.env['ADONIS_CREATE_APP_BOILERPLATE'] === 'api';
    /**
     * Create app config file
     */
    const appConfig = new files.MustacheFile(projectRoot, 'config/app.ts', APP_TEMPLATE_STUB);
    if (appConfig.exists()) {
        logger.skip('config/app.ts');
    }
    else {
        appConfig.apply({ forceContentNegotiationToJSON: isApiBoilerplate }).commit();
        logger.create('config/app.ts');
    }
    /**
     * Create static config file when boilerplate
     * is not for the api
     */
    if (!isApiBoilerplate) {
        const staticConfig = new files.MustacheFile(projectRoot, 'config/static.ts', STATIC_TEMPLATE_STUB);
        if (staticConfig.exists()) {
            logger.skip('config/static.ts');
        }
        else {
            staticConfig.apply({}).commit();
            logger.create('config/static.ts');
        }
    }
}
exports.default = instructions;
