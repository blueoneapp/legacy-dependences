/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../adonis-typings/index.d.ts" />
/// <reference types="node" />
import { Stats } from 'fs';
import { Route } from './Router/Route';
import { RouteGroup } from './Router/Group';
import { BriskRoute } from './Router/BriskRoute';
import { RouteResource } from './Router/Resource';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { RouteJSON, MakeUrlOptions, MakeSignedUrlOptions } from '@ioc:Adonis/Core/Route';
/**
 * Makes input string consistent by having only the starting
 * slash
 */
export declare function dropSlash(input: string): string;
/**
 * Converts and array of routes or route groups or route resource to a flat
 * list of route defination.
 */
export declare function toRoutesJSON(routes: (RouteGroup | RouteResource | Route | BriskRoute)[]): RouteJSON[];
/**
 * Makes url for a route pattern and params and querystring.
 */
export declare function processPattern(pattern: string, data: any): string;
/**
 * Returns a boolean telling if the return value must be used as
 * the response body or not
 */
export declare function useReturnValue(returnValue: any, ctx: HttpContextContract): boolean;
/**
 * Since finding the trusted proxy based upon the remote address
 * is an expensive function, we cache its result
 */
export declare function trustProxy(remoteAddress: string, proxyFn: (addr: string, distance: number) => boolean): boolean;
/**
 * Normalizes the make url options by allowing params to appear on
 * top level object with option to nest inside `params` property.
 */
export declare function normalizeMakeUrlOptions(options?: MakeUrlOptions): Required<MakeUrlOptions>;
/**
 * Normalizes the make signed url options by allowing params to appear on
 * top level object with option to nest inside `params` property.
 */
export declare function normalizeMakeSignedUrlOptions(options?: MakeSignedUrlOptions): Required<MakeUrlOptions> & {
    purpose?: string;
    expiresIn?: string | number;
};
/**
 * Wraps `fs.stat` to promise interface.
 */
export declare function statFn(filePath: string): Promise<Stats>;
