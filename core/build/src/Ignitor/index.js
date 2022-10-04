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
exports.Ignitor = void 0;
const Ace_1 = require("./Ace");
const HttpServer_1 = require("./HttpServer");
const Bootstrapper_1 = require("./Bootstrapper");
/**
 * Ignitor is used to wireup different pieces of AdonisJs to bootstrap
 * the application.
 */
class Ignitor {
    constructor(appRoot) {
        this.appRoot = appRoot;
    }
    /**
     * Returns instance of bootstrapper to boostrap
     * the application
     */
    boostrapper() {
        return new Bootstrapper_1.Bootstrapper(this.appRoot, true);
    }
    /**
     * Returns instance of server to start
     * the HTTP server
     */
    httpServer() {
        return new HttpServer_1.HttpServer(this.appRoot);
    }
    /**
     * Returns instance of ace to handle console
     * commands
     */
    ace() {
        return new Ace_1.Ace(this.appRoot);
    }
}
exports.Ignitor = Ignitor;
