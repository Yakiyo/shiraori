import { Command } from './types.ts';
import ping from './commands/ping.ts';
import help from './commands/help.ts';

const commandMap = new Map<Command['data']['name'], Command>();

commandMap
	.set(ping.data.name, ping)
	.set(help.data.name, help);

export const commands = commandMap;
