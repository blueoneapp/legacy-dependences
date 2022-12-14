import { Exception } from '@poppinss/utils';
/**
 * Exceptions related to the HTTP router
 */
export declare class RouterException extends Exception {
    /**
     * Raised when one of the routes inside the group doesn't have a name
     * but an attempt is made to name the group
     */
    static cannotDefineGroupName(): void;
    /**
     * Raised when a duplicate route pattern is find for the same HTTP method
     */
    static duplicateRoute(method: string, pattern: string): void;
    /**
     * Raised when a route has duplicate params
     */
    static duplicateRouteParam(param: string, pattern: string): RouterException;
    /**
     * Raised when route name is not unique
     */
    static duplicateRouteName(name: string): void;
    /**
     * Raised when unable to make url for a given route, because one of the
     * params value is not defined
     */
    static cannotMakeRoute(param: string, pattern: string): void;
    /**
     * Raised when unable to lookup a route using its identifier
     */
    static cannotLookupRoute(identifier: string): void;
}
