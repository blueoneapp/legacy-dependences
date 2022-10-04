import { BaseCommand } from '@adonisjs/ace';
/**
 * A command to generate a secure app key
 */
export default class GenerateKey extends BaseCommand {
    static commandName: string;
    static description: string;
    handle(): Promise<void>;
}
