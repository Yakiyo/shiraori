import { Command } from './types.ts';
import ping from './commands/ping.ts';
import help from './commands/help.ts';
import anime from './commands/anime.ts';

const commandMap = new Map<Command['data']['name'], Command>();

commandMap
	.set(ping.data.name, ping)
	.set(help.data.name, help)
	.set(anime.data.name, anime);

export const commands = commandMap;
