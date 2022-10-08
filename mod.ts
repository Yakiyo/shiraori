import {
	json,
	serve,
	validateRequest,
} from 'https://deno.land/x/sift@0.6.0/mod.ts';
import {
	Interaction,
	InteractionResponseTypes,
	InteractionTypes,
	verifySignature,
} from 'https://deno.land/x/discordeno@16.0.0/mod.ts';
import { camelize } from 'https://deno.land/x/camelize@2.0.0/mod.ts';

import { commands } from './src/mod.ts';

serve({
	'/interaction': main,
});

async function main(request: Request) {
	const { error } = await validateRequest(request, {
		POST: {
			headers: ['X-Signature-Ed25519', 'X-Signature-Timestamp'],
		},
	});
	if (error) {
		return json({ error: error.message }, { status: error.status });
	}
	const public_key = Deno.env.get('DISCORD_PUBLIC_KEY');
	if (!public_key) {
		return json({
			error: 'Missing Discord public key from environment variables.',
		});
	}
	const signature = request.headers.get('X-Signature-Ed25519')!;
	const timestamp = request.headers.get('X-Signature-Timestamp')!;
	const { body, isValid } = verifySignature({
		publicKey: public_key,
		signature,
		timestamp,
		body: await request.text(),
	});
	if (!isValid) {
		return json({
			error: 'Invalid request; could not verify the request',
		}, {
			status: 401,
		});
	}
	const payload = camelize<Interaction>(
		JSON.parse(body),
	) as Interaction;
	if (payload.type === InteractionTypes.Ping) {
		return json({
			type: InteractionResponseTypes.Pong,
		});
	} else if (payload.type === InteractionTypes.ApplicationCommand) {
		if (!payload.data?.name) {
			return json({
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					content: 'Error: Received an interaction without any name.',
				},
			});
		}
		const command = commands.get(payload.data.name);
		if (!command) {
			return json({
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					content:
						'Unknown command received. This command is possibly not registered yet.',
				},
			});
		}
		const result = command.execute(payload);
		if (!Reflect.has(result, 'type')) {
			return json({
				data: result,
				type: InteractionResponseTypes.ChannelMessageWithSource,
			});
		}
		return json(result);
	}

	return json({ error: 'Bad request' }, { status: 400 });
}
