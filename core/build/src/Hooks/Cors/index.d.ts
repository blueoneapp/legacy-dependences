import { CorsConfig } from '@ioc:Adonis/Core/Cors';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
/**
 * The Cors middleware class to handle preflight request as per the CORS
 * RFC https://www.w3.org/TR/cors/.
 *
 * This is a functional middleware and shared among all requests. So make
 * sure not to set request specific instance properties.
 */
export declare class Cors {
    private options;
    private isEnabled;
    constructor(options: CorsConfig);
    /**
     * Normalize config options
     */
    private normalizeOptions;
    /**
     * Computes the origin for the current request based upon the
     * user config.
     *
     * Origin match is always case sensitive
     */
    private computeResponseOrigin;
    /**
     * Returns an array of headers allowed based upon user config
     * and request headers.
     *
     * The array items are casted to lowercase for case insensitive
     * match.
     */
    private computedAllowedHeaders;
    /**
     * Sets the `Access-Control-Allow-Origin` header
     */
    private setOrigin;
    /**
     * Setting `Access-Control-Expose-Headers` headers, when custom headers
     * are defined. If no custom headers are defined, then simple response
     * headers are used instead.
     */
    private setExposedHeaders;
    /**
     * Allows `Access-Control-Allow-Credentials` when enabled inside the user
     * config.
     */
    private setCredentials;
    /**
     * Set `Access-Control-Allow-Methods` header.
     */
    private setAllowMethods;
    /**
     * Set `Access-Control-Allow-Headers` header.
     */
    private setAllowHeaders;
    /**
     * Set `Access-Control-Max-Age` header.
     */
    private setMaxAge;
    /**
     * Ends the preflight request with 204 status code
     */
    private endPreFlight;
    /**
     * Handle HTTP request for CORS. This method is binded as a before hook
     * to the HTTP server.
     */
    handle({ request, response }: HttpContextContract): Promise<void>;
}
