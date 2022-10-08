import { ApplicationCommandType, Command } from '../types.ts';

const help: Command = {
	data: {
		name: 'help',
		description: 'Help Command',
		type: ApplicationCommandType.CHAT_INPUT,
	},
	execute(_payload) {
		return { content: 'Help is here!' };
	},
};

export default help;
