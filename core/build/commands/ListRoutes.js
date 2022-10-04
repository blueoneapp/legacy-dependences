"use strict";
/*
 * @adonisjs/core
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_table3_1 = __importDefault(require("cli-table3"));
const fold_1 = require("@adonisjs/fold");
const ace_1 = require("@adonisjs/ace");
/**
 * A command to display a list of routes
 */
class ListRoutes extends ace_1.BaseCommand {
    /**
     * Find route from the routes store. We expect it to always return a route
     */
    findRoute(router, domain, methods, pattern) {
        return router['store']['tree'].domains[domain][methods[0]].routes[pattern];
    }
    /**
     * Returns an array of routes as JSON
     */
    outputJSON(router) {
        return router['lookupStore'].map((lookupRoute) => {
            const route = this.findRoute(router, lookupRoute.domain, lookupRoute.methods, lookupRoute.pattern);
            let handler = 'Closure';
            const middleware = route
                ? route.middleware.map((one) => (typeof one === 'function' ? 'Closure' : one))
                : [];
            if (route) {
                if (route.meta.resolvedHandler.type !== 'function' && route.meta.namespace) {
                    handler = `${route.meta.resolvedHandler['namespace']}.${route.meta.resolvedHandler['method']}`;
                }
                else if (route.meta.resolvedHandler.type !== 'function') {
                    const method = route.meta.resolvedHandler['method'];
                    const routeHandler = route.handler;
                    handler = `${routeHandler.replace(new RegExp(`.${method}$`), '')}.${method}`;
                }
            }
            else if (typeof lookupRoute.handler === 'string') {
                handler = lookupRoute.handler;
            }
            return {
                methods: lookupRoute.methods,
                name: lookupRoute.name || '',
                pattern: lookupRoute.pattern,
                handler: handler,
                domain: lookupRoute.domain === 'root' ? '' : lookupRoute.domain,
                middleware: middleware,
            };
        });
    }
    /**
     * Output routes a table string
     */
    outputTable(router) {
        const table = new cli_table3_1.default({
            head: ['Route', 'Handler', 'Middleware', 'Name', 'Domain'].map((col) => this.colors.cyan(col)),
        });
        this.outputJSON(router).forEach((route) => {
            const row = [
                `${this.colors.dim(route.methods.join(','))} ${route.pattern}`,
                typeof route.handler === 'function' ? 'Closure' : route.handler,
                route.middleware.join(','),
                route.name,
                route.domain,
            ];
            table.push(row);
        });
        return table.toString();
    }
    /**
     * Log message
     */
    log(message) {
        if (this.application.environment === 'test') {
            this.logger.logs.push(message);
        }
        else {
            console.log(message);
        }
    }
    async handle(router) {
        router.commit();
        if (this.json) {
            this.log(JSON.stringify(this.outputJSON(router), null, 2));
        }
        else {
            this.log(this.outputTable(router));
        }
    }
}
ListRoutes.commandName = 'list:routes';
ListRoutes.description = 'List application routes';
/**
 * Load application
 */
ListRoutes.settings = {
    loadApp: true,
};
__decorate([
    ace_1.flags.boolean({ description: 'Output as JSON' }),
    __metadata("design:type", Boolean)
], ListRoutes.prototype, "json", void 0);
__decorate([
    fold_1.inject(['Adonis/Core/Route']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListRoutes.prototype, "handle", null);
exports.default = ListRoutes;
