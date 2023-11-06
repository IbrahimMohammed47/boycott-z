function makeJsonResponse(data, status = 200, message) {
	let json;
	if (typeof data == 'object') {
		json = JSON.stringify({ data, status, message }, null, 2);
	} else {
		json = data;
	}

	return new Response(json, {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	});
}

export default {
	async fetch(request, env, ctx) {
		const { searchParams, pathname } = new URL(request.url);
		let listName = searchParams.get('list');
		let key = searchParams.get('key');
		let list;

		if (pathname.slice(1) === 'get_lists') {
			return makeJsonResponse(['brands', 'websites']);
		} else if (pathname.slice(1) === 'get_list') {
			if (listName) {
				switch (listName) {
					case 'brands':
						list = env.BOYCOTT_BRANDS;
						break;
					case 'websites':
						list = env.BOYCOTT_WEBSITES;
						break;
					default:
						list = null;
						break;
				}
			} else {
				return makeJsonResponse(null, 400, 'list name not provided');
			}
			if (!list) {
				return makeJsonResponse(null, 404, 'list not found');
			} else {
				if (!key) {
					let allKeys = await list.list();
					return makeJsonResponse(allKeys.keys.map((x) => x.name));
				} else {
					let fullValue = await list.get(key);
					if (fullValue) {
						return makeJsonResponse(fullValue);
					} else {
						return makeJsonResponse(null, 404, `key not found in list ${listName}`);
					}
				}
			}
		} else {
			return makeJsonResponse(null, 404, `uknown route`);
		}
	},
};
