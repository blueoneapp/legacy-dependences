import adonisAce from '@adonisjs/ace';
/**
 * Exposes the API to run core commands from `@adonisjs/assembler`.
 */
export declare class CoreCommands {
    private appRoot;
    private ace;
    /**
     * List of core commands
     */
    static commandsList: string[];
    /**
     * A local list of assembler commands. We need this, so that when assembler
     * is not installed (probably in production) and someone is trying to
     * build the project by running `serve` or `build`, we should give
     * them a better descriptive error.
     *
     * Also, do note that at times this list will be stale, but we get it back
     * in sync over time.
     */
    static localCommandsList: string[];
    /**
     * Returns assembler manifest file for showing help
     */
    static getManifestJSON(): any;
    private application;
    constructor(appRoot: string, ace: typeof adonisAce);
    /**
     * Loading `.adonisrc.json` file with custom error handling when the file
     * is missing. With ace commands we always use `RuntimeException`, since
     * we handle it in a different way to show console friendly one liner
     * errors.
     */
    private setupApplication;
    /**
     * Lazy load @adonisjs/assembler
     */
    private importAssembler;
    /**
     * Handle core commands
     */
    handle(argv: string[]): Promise<void>;
}
