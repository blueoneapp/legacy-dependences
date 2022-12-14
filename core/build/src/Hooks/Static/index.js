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
exports.ServeStatic = void 0;
const serve_static_1 = __importDefault(require("serve-static"));
/**
 * A simple server hook to serve static files from the public directory.
 * The public directory must be configured within the `.adonisrc.json`
 * file.
 */
class ServeStatic {
    constructor(publicPath, config) {
        this.publicPath = publicPath;
        this.config = config;
        this.serve = serve_static_1.default(this.publicPath, this.config);
    }
    /**
     * Handle the request to serve static files.
     */
    async handle({ request, response }) {
        return new Promise((resolve) => {
            function next() {
                response.response.removeListener('finish', next);
                resolve();
            }
            /**
             * Whether or not the file has been served by serve static, we
             * will cleanup the finish event listener.
             *
             * 1. If file has been served, then the `finish` callback get invoked.
             * 2. If file has not been served, then callback (3rd argument) will
             *    get invoked.
             */
            response.response.addListener('finish', next);
            this.serve(request.request, response.response, next);
        });
    }
}
exports.ServeStatic = ServeStatic;
