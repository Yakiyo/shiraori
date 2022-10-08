import 'https://deno.land/x/dotenv@v3.2.0/load.ts';
import { commands } from './src/mod.ts';
import { request } from './src/util.ts';
import { Command } from './src/types.ts';

const appId = Deno.env.get('APP_ID');
const guildId = Deno.env.get('GUILD_ID');

/**
 * Registers a slash command
 * @param data
 */
async function register(data: Command['data'], endpoint: string) {
	try {
		return await request(endpoint, {
			body: data,
			method: 'POST',
		});
	} catch (err) {
		console.error(err);
		return null;
	}
}

/**
 * Deploys all the commands to discord
 * Runs the `register` command recursively for all commands
 */
async function deploy() {
	// follow the cli command with 'global' or 'true' to deploy commands globally, else deploys to guild
	const endpoint = ['global', 'true'].includes(Deno.args[0])
		? `applications/${appId}/commands`
		: `applications/${appId}/guilds/${guildId}/commands`;
	for (const command of commands.values()) {
		console.info(`Registering ${command.data.name}`);
		const res = await register(command.data, endpoint);
		console.log(await res?.json());
	}
}

deploy();
