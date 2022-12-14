import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AssetsConfig } from '@ioc:Adonis/Core/Static';
/**
 * A simple server hook to serve static files from the public directory.
 * The public directory must be configured within the `.adonisrc.json`
 * file.
 */
export declare class ServeStatic {
    private publicPath;
    private config;
    private serve;
    constructor(publicPath: string, config: AssetsConfig);
    /**
     * Handle the request to serve static files.
     */
    handle({ request, response }: HttpContextContract): Promise<unknown>;
}
