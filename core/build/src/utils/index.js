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
exports.optionalResolveAndRequire = exports.optionalRequire = exports.isMissingModuleError = void 0;
const utils_1 = require("@poppinss/utils");
/**
 * Helper to know if error belongs to a missing module
 * error
 */
function isMissingModuleError(error) {
    return ['MODULE_NOT_FOUND', 'ENOENT'].includes(error.code);
}
exports.isMissingModuleError = isMissingModuleError;
/**
 * Optionally require the file and ignore non existing errors
 */
function optionalRequire(filePath, optional = false) {
    try {
        return utils_1.esmRequire(filePath);
    }
    catch (error) {
        if (isMissingModuleError(error) && optional) {
            return null;
        }
        throw error;
    }
}
exports.optionalRequire = optionalRequire;
/**
 * Optionally resolve and require the file and
 * ignore non existing errors
 */
function optionalResolveAndRequire(filePath, fromPath, optional = false) {
    try {
        return optionalRequire(utils_1.resolveFrom(fromPath, filePath));
    }
    catch (error) {
        if (isMissingModuleError(error) && optional) {
            return null;
        }
        throw error;
    }
}
exports.optionalResolveAndRequire = optionalResolveAndRequire;
