/**
 * Make a request to discord
 *
 * @export
 * @param {string} endpoint
 * @param {Record<string, unknown>} options
 * @returns {*}
 */
export async function request(
	endpoint: string,
	options: Record<string, unknown>,
) {
	const url = 'https://discord.com/api/v10/' + endpoint;
	if (options.body) options.body = JSON.stringify(options.body);
	const res = await fetch(url, {
		headers: {
			Authorization: `Bot ${Deno.env.get('DISCORD_TOKEN')}`,
			'Content-Type': 'application/json; charset=UTF-8',
			'User-Agent': 'Deno Bot',
		},
		...options,
	});
	if (!res.ok) {
		const data = await res.json();
		console.log(res.status);
		throw new Error(JSON.stringify(data));
	}
	return res;
}
