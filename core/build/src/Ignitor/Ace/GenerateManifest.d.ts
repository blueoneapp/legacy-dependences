import adonisAce from '@adonisjs/ace';
/**
 * Exposes the API to generate the manifest file
 */
export declare class GenerateManifest {
    private buildRoot;
    private ace;
    private bootstrapper;
    /**
     * Source root always points to the compiled source
     * code.
     */
    constructor(buildRoot: string, ace: typeof adonisAce);
    /**
     * Returns manifest object for showing help
     */
    static getManifestJSON(): {
        'generate:manifest': {
            commandName: string;
            description: string;
            args: never[];
            flags: never[];
            settings: {};
        };
    };
    /**
     * Raises human friendly error when the `build` directory is
     * missing during `generate:manifest` command.
     */
    private ensureBuildRoot;
    /**
     * Generates the manifest file for commands
     */
    handle(): Promise<void>;
}
