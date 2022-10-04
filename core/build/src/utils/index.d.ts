/// <reference types="node" />
/**
 * Helper to know if error belongs to a missing module
 * error
 */
export declare function isMissingModuleError(error: NodeJS.ErrnoException): boolean;
/**
 * Optionally require the file and ignore non existing errors
 */
export declare function optionalRequire(filePath: string, optional?: boolean): any | null;
/**
 * Optionally resolve and require the file and
 * ignore non existing errors
 */
export declare function optionalResolveAndRequire(filePath: string, fromPath: string, optional?: boolean): any | null;
