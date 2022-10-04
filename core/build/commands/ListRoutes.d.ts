import { BaseCommand } from '@adonisjs/ace';
import { RouterContract } from '@ioc:Adonis/Core/Route';
/**
 * A command to display a list of routes
 */
export default class ListRoutes extends BaseCommand {
    static commandName: string;
    static description: string;
    json: boolean;
    /**
     * Load application
     */
    static settings: {
        loadApp: boolean;
    };
    /**
     * Find route from the routes store. We expect it to always return a route
     */
    private findRoute;
    /**
     * Returns an array of routes as JSON
     */
    private outputJSON;
    /**
     * Output routes a table string
     */
    private outputTable;
    /**
     * Log message
     */
    private log;
    handle(router: RouterContract): Promise<void>;
}
