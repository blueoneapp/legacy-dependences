/**
 * Exposes the API to execute ace commands.
 */
export declare class Ace {
    private appRoot;
    constructor(appRoot: string);
    /**
     * Lazy load ace
     */
    private importAce;
    /**
     * Returns a boolean telling if project root has typescript
     * source code. This is done by inspecting `.adonisrc.json`
     * file.
     */
    private isTsProject;
    /**
     * Returns the build directory relative path. Call this when you are
     * sure that it is a valid typescript project
     */
    private getBuildDir;
    /**
     * Handles the ace command
     */
    handle(argv: string[]): Promise<void>;
}
