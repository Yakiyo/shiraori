import { ApplicationCommandType, Command } from '../types.ts';

const ping: Command = {
	data: {
		name: 'ping',
		description: 'Returns pong!',
		type: ApplicationCommandType.CHAT_INPUT,
	},
	execute(_payload) {
		return { content: 'Pong!' };
	},
};

export default ping;
