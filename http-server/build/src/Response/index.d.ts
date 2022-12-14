/**
 * @adonisjs/http-server
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
/// <reference path="../../adonis-typings/index.d.ts" />
/// <reference types="node" />
import { Macroable } from 'macroable';
import { ServerResponse, IncomingMessage } from 'http';
import { CookieOptions, CastableHeader, ResponseConfig, ResponseStream, ResponseContract, RedirectContract } from '@ioc:Adonis/Core/Response';
import { RouterContract } from '@ioc:Adonis/Core/Route';
import { EncryptionContract } from '@ioc:Adonis/Core/Encryption';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
/**
 * The response is a wrapper over [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse)
 * streamlining the process of writing response body and automatically setting up appropriate headers.
 */
export declare class Response extends Macroable implements ResponseContract {
    request: IncomingMessage;
    response: ServerResponse;
    private encryption;
    private config;
    private router;
    protected static macros: {};
    protected static getters: {};
    private headers;
    private explicitStatus;
    private writerMethod;
    private cookieSerializer;
    /**
     * Returns a boolean telling if lazy body is already set or not
     */
    hasLazyBody: boolean;
    /**
     * Lazy body is used to set the response body. However, do not
     * write it on the socket immediately unless `response.finish`
     * is called.
     */
    lazyBody: any[];
    /**
     * The ctx will be set by the context itself. It creates a circular
     * reference
     */
    ctx?: HttpContextContract;
    constructor(request: IncomingMessage, response: ServerResponse, encryption: EncryptionContract, config: ResponseConfig, router: RouterContract);
    /**
     * Returns a boolean telling if response is finished or not.
     * Any more attempts to update headers or body will result
     * in raised exceptions.
     */
    get finished(): boolean;
    /**
     * Returns a boolean telling if response headers has been sent or not.
     * Any more attempts to update headers will result in raised
     * exceptions.
     */
    get headersSent(): boolean;
    /**
     * Returns a boolean telling if response headers and body is written
     * or not. When value is `true`, you can feel free to write headers
     * and body.
     */
    get isPending(): boolean;
    /**
     * Normalizes header value to a string or an array of string
     */
    private castHeaderValue;
    /**
     * Ends the response by flushing headers and writing body
     */
    private endResponse;
    /**
     * Returns type for the content body. Only following types are allowed
     *
     * - Dates
     * - Arrays
     * - Booleans
     * - Objects
     * - Strings
     * - Buffer
     */
    private getDataType;
    /**
     * Writes the body with appropriate response headers. Etag header is set
     * when `generateEtag` is set to `true`.
     *
     * Empty body results in `204`.
     */
    protected writeBody(content: any, generateEtag: boolean, jsonpCallbackName?: string): void;
    /**
     * Stream the body to the response and handles cleaning up the stream
     */
    protected streamBody(body: ResponseStream, errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]): Promise<unknown>;
    /**
     * Downloads a file by streaming it to the response
     */
    protected streamFileForDownload(filePath: string, generateEtag: boolean, errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]): Promise<unknown>;
    /**
     * Writes headers to the response.
     */
    flushHeaders(statusCode?: number): this;
    /**
     * Returns the existing value for a given HTTP response
     * header.
     */
    getHeader(key: string): any;
    /**
     * Set header on the response. To `append` values to the existing header, we suggest
     * using [[append]] method.
     *
     * If `value` is non existy, then header won't be set.
     *
     * @example
     * ```js
     * response.header('content-type', 'application/json')
     * ```
     */
    header(key: string, value: CastableHeader): this;
    /**
     * Append value to an existing header. To replace the value, we suggest using
     * [[header]] method.
     *
     * If `value` is not existy, then header won't be set.
     *
     * @example
     * ```js
     * response.append('set-cookie', 'username=virk')
     * ```
     */
    append(key: string, value: CastableHeader): this;
    /**
     * Adds HTTP response header, when it doesn't exists already.
     */
    safeHeader(key: string, value: CastableHeader): this;
    /**
     * Removes the existing response header from being sent.
     */
    removeHeader(key: string): this;
    /**
     * Set HTTP status code
     */
    status(code: number): this;
    /**
     * Set's status code only when it's not explictly
     * set
     */
    safeStatus(code: number): this;
    /**
     * Set response type by looking up for the mime-type using
     * partial types like file extensions.
     *
     * Make sure to read [mime-types](https://www.npmjs.com/package/mime-types) docs
     * too.
     *
     * @example
     * ```js
     * response.type('.json') // Content-type: application/json
     * ```
     */
    type(type: string, charset?: string): this;
    /**
     * Set the Vary HTTP header
     */
    vary(field: string): this;
    /**
     * Set etag by computing hash from the body. This class will set the etag automatically
     * when `etag = true` in the defined config object.
     *
     * Use this function, when you want to compute etag manually for some other resons.
     */
    setEtag(body: any, weak?: boolean): this;
    /**
     * Returns a boolean telling if the new response etag evaluates same
     * as the request header `if-none-match`. In case of `true`, the
     * server must return `304` response, telling the browser to
     * use the client cache.
     *
     * You won't have to deal with this method directly, since AdonisJs will
     * handle this for you when `http.etag = true` inside `config/app.js` file.
     *
     * However, this is how you can use it manually.
     *
     * @example
     * ```js
     * const responseBody = view.render('some-view')
     *
     * // sets the HTTP etag header for response
     * response.setEtag(responseBody)
     *
     * if (response.fresh()) {
     *   response.sendStatus(304)
     * } else {
     *   response.send(responseBody)
     * }
     * ```
     */
    fresh(): boolean;
    /**
     * Send the body as response and optionally generate etag. The default value
     * is read from `config/app.js` file, using `http.etag` property.
     *
     * This method buffers the body if `explicitEnd = true`, which is the default
     * behavior and do not change, unless you know what you are doing.
     */
    send(body: any, generateEtag?: boolean): void;
    /**
     * Alias of [[send]]
     */
    json(body: any, generateEtag?: boolean): void;
    /**
     * Writes response as JSONP. The callback name is resolved as follows, with priority
     * from top to bottom.
     *
     * 1. Explicitly defined as 2nd Param.
     * 2. Fetch from request query string.
     * 3. Use the config value `http.jsonpCallbackName` from `config/app.js`.
     * 4. Fallback to `callback`.
     *
     * This method buffers the body if `explicitEnd = true`, which is the default
     * behavior and do not change, unless you know what you are doing.
     */
    jsonp(body: any, callbackName?: string, generateEtag?: boolean): void;
    /**
     * Pipe stream to the response. This method will gracefully destroy
     * the stream, avoiding memory leaks.
     *
     * If `raiseErrors=false`, then this method will self handle all the exceptions by
     * writing a generic HTTP response. To have more control over the error, it is
     * recommended to set `raiseErrors=true` and wrap this function inside a
     * `try/catch` statement.
     *
     * Streaming a file from the disk and showing 404 when file is missing.
     *
     * @example
     * ```js
     * // Errors handled automatically with generic HTTP response
     * response.stream(fs.createReadStream('file.txt'))
     *
     * // Manually handle (note the await call)
     * try {
     *   await response.stream(fs.createReadStream('file.txt'))
     * } catch () {
     *   response.status(404).send('File not found')
     * }
     * ```
     */
    stream(body: ResponseStream, errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]): void;
    /**
     * Download file by streaming it from the file path. This method will setup
     * appropriate `Content-type`, `Content-type` and `Last-modified` headers.
     *
     * Unexpected stream errors are handled gracefully to avoid memory leaks.
     *
     * If `raiseErrors=false`, then this method will self handle all the exceptions by
     * writing a generic HTTP response. To have more control over the error, it is
     * recommended to set `raiseErrors=true` and wrap this function inside a
     * `try/catch` statement.
     *
     * @example
     * ```js
     * // Errors handled automatically with generic HTTP response
     * response.download('somefile.jpg')
     *
     * // Manually handle (note the await call)
     * try {
     *   await response.download('somefile.jpg')
     * } catch (error) {
     *   response.status(error.code === 'ENOENT' ? 404 : 500)
     *   response.send('Cannot process file')
     * }
     * ```
     */
    download(filePath: string, generateEtag?: boolean, errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]): void;
    /**
     * Download the file by forcing the user to save the file vs displaying it
     * within the browser.
     *
     * Internally calls [[download]]
     */
    attachment(filePath: string, name?: string, disposition?: string, generateEtag?: boolean, errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]): void;
    /**
     * Set the location header.
     *
     * @example
     * ```js
     * response.location('/login')
     * ```
     */
    location(url: string): this;
    /**
     * Redirect the request.
     *
     * @example
     * ```js
     * response.redirect('/foo')
     * response.redirect().toRoute('foo.bar')
     * response.redirect().back()
     * ```
     */
    redirect(): RedirectContract;
    redirect(path: string, forwardQueryString?: boolean, statusCode?: number): void;
    /**
     * Abort the request with custom body and a status code. 400 is
     * used when status is not defined
     */
    abort(body: any, status?: number): never;
    /**
     * Abort the request with custom body and a status code when
     * passed condition returns `true`
     */
    abortIf(condition: any, body: any, status?: number): void;
    /**
     * Abort the request with custom body and a status code when
     * passed condition returns `false`
     */
    abortUnless(condition: any, body: any, status?: number): asserts condition;
    /**
     * Set signed cookie as the response header. The inline options overrides
     * all options from the config (means they are not merged).
     */
    cookie(key: string, value: any, options?: Partial<CookieOptions>): this;
    /**
     * Set unsigned cookie as the response header. The inline options overrides
     * all options from the config (means they are not merged)
     */
    plainCookie(key: string, value: any, options?: Partial<CookieOptions>): this;
    /**
     * Set unsigned cookie as the response header. The inline options overrides
     * all options from the config (means they are not merged)
     */
    encryptedCookie(key: string, value: any, options?: Partial<CookieOptions>): this;
    /**
     * Clear existing cookie.
     */
    clearCookie(key: string, options?: Partial<CookieOptions>): this;
    /**
     * Finishes the response by writing the lazy body, when `explicitEnd = true`
     * and response is already pending.
     *
     * Calling this method twice or when `explicitEnd = false` is noop.
     */
    finish(): void;
    continue(): void;
    switchingProtocols(): void;
    ok(body: any, generateEtag?: boolean): void;
    created(body?: any, generateEtag?: boolean): void;
    accepted(body: any, generateEtag?: boolean): void;
    nonAuthoritativeInformation(body: any, generateEtag?: boolean): void;
    noContent(): void;
    resetContent(): void;
    partialContent(body: any, generateEtag?: boolean): void;
    multipleChoices(body?: any, generateEtag?: boolean): void;
    movedPermanently(body?: any, generateEtag?: boolean): void;
    movedTemporarily(body?: any, generateEtag?: boolean): void;
    seeOther(body?: any, generateEtag?: boolean): void;
    notModified(body?: any, generateEtag?: boolean): void;
    useProxy(body?: any, generateEtag?: boolean): void;
    temporaryRedirect(body?: any, generateEtag?: boolean): void;
    badRequest(body?: any, generateEtag?: boolean): void;
    unauthorized(body?: any, generateEtag?: boolean): void;
    paymentRequired(body?: any, generateEtag?: boolean): void;
    forbidden(body?: any, generateEtag?: boolean): void;
    notFound(body?: any, generateEtag?: boolean): void;
    methodNotAllowed(body?: any, generateEtag?: boolean): void;
    notAcceptable(body?: any, generateEtag?: boolean): void;
    proxyAuthenticationRequired(body?: any, generateEtag?: boolean): void;
    requestTimeout(body?: any, generateEtag?: boolean): void;
    conflict(body?: any, generateEtag?: boolean): void;
    gone(body?: any, generateEtag?: boolean): void;
    lengthRequired(body?: any, generateEtag?: boolean): void;
    preconditionFailed(body?: any, generateEtag?: boolean): void;
    requestEntityTooLarge(body?: any, generateEtag?: boolean): void;
    requestUriTooLong(body?: any, generateEtag?: boolean): void;
    unsupportedMediaType(body?: any, generateEtag?: boolean): void;
    requestedRangeNotSatisfiable(body?: any, generateEtag?: boolean): void;
    expectationFailed(body?: any, generateEtag?: boolean): void;
    unprocessableEntity(body?: any, generateEtag?: boolean): void;
    tooManyRequests(body?: any, generateEtag?: boolean): void;
    internalServerError(body?: any, generateEtag?: boolean): void;
    notImplemented(body?: any, generateEtag?: boolean): void;
    badGateway(body?: any, generateEtag?: boolean): void;
    serviceUnavailable(body?: any, generateEtag?: boolean): void;
    gatewayTimeout(body?: any, generateEtag?: boolean): void;
    httpVersionNotSupported(body?: any, generateEtag?: boolean): void;
}
