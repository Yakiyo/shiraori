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

type Options = {
	method: 'POST';
	headers: {
		'Content-Type': 'application/json';
		'Accept': 'application/json';
	};
	body: string;
};

/**
 * Base function to make requests
 * @private
 * @export
 * @param {string} url
 * @param {Options} options
 * @returns {*}
 */
export async function base_req_al(url: string, options: Options) {
	return await fetch(url, options as Record<string, unknown>)
		.then((response) => {
			return response.json()
				.then((json) => {
					return response.ok ? json : Promise.reject(json);
				});
		})
		.then((e) => e.data)
		.catch((errors) => {
			const error = errors[0] as Record<string, unknown>;
			if (error.message === 'Not Found.') {
				throw new Error(
					`Not found. Got status code ${error.status}`,
				);
			} else {
				throw new Error(
					`Unknown error. Got status code ${error.status}. Reason: ${error.message}`,
				);
			}
		});
}

/**
 * Simplified version of request. Options and url is set, only provide the body
 * @private
 * @export
 * @param {Record<string, unknown>} body
 * @returns {*}
 */
export async function req_al(
	{ query, variables }: {
		query: string;
		variables: Record<string, unknown>;
	},
) {
	return await base_req_al('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: query,
			variables: variables,
		}),
	});
}

/**
 * Shortens a string upto provided length
 * @param {string} string the string to shorten
 * @param {number} num length upto which to shorten
 * @returns string
 */
export function shorten(string: string, num = 1000) {
	if (typeof string !== 'string') return undefined;

	if (string.length > num) {
		return string.substring(0, num + 1) + '...';
	} else {
		return string;
	}
}
/**
 * Coverts the first character of the string to uppercase and the rest to lowercase
 * @param {string} string the string to casify
 * @returns string
 */
export function casify(string: string) {
	if (typeof string == 'string') {
		const space = string.split(/_/g);
		return space.map((word) =>
			word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
		).join(' ');
	} else {
		return 'null';
	}
}
