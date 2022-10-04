import adonisAce from '@adonisjs/ace';
/**
 * Exposes the API to execute app commands registered under
 * the manifest file.
 */
export declare class AppCommands {
    private buildRoot;
    private ace;
    private additionalManifestCommands;
    private bootstrapper;
    /**
     * Whether or not the app was wired. App is only wired, when
     * loadApp inside the command setting is true.
     */
    private wired;
    /**
     * Signals listener to listen for exit signals and kill command
     */
    private signalsListener;
    /**
     * Source root always points to the compiled source
     * code.
     */
    constructor(buildRoot: string, ace: typeof adonisAce, additionalManifestCommands: any);
    /**
     * Print commands help
     */
    private printHelp;
    /**
     * Raises human friendly error when the `build` directory is
     * missing during `generate:manifest` command.
     */
    private ensureBuildRoot;
    /**
     * Hooks into kernel lifecycle events to conditionally
     * load the app.
     */
    private addKernelHooks;
    /**
     * Adding flags
     */
    private addKernelFlags;
    /**
     * Boot the application.
     */
    private wire;
    /**
     * Handle application command
     */
    handle(argv: string[]): Promise<void>;
}
