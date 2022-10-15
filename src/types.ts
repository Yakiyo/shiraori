import {
	ApplicationCommandOption,
	Interaction,
	InteractionCallbackData,
	InteractionResponse,
} from 'https://deno.land/x/discordeno@16.0.0/mod.ts';

export { ApplicationCommandOptionTypes } from 'https://deno.land/x/discordeno@16.0.0/mod.ts';
// Enums for application types
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types

export enum ApplicationCommandType {
	CHAT_INPUT = 1,
	USER,
	MESSAGE,
}

// Command interface
export interface Command {
	data: {
		name: string;
		description: string;
		options?: ApplicationCommandOption[];
		type: ApplicationCommandType;
	};
	execute(
		payload: Interaction,
	):
		| InteractionResponse
		| InteractionCallbackData
		| Promise<InteractionResponse | InteractionCallbackData>;
}
