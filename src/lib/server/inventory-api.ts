import { SERVER_BASE_URL } from '$env/static/private';

export const fetchInventory = async (token: string, url: URL): Promise<DataInventory> => {
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;

	const headerOptions = {
		Authorization: `Bearer ${token}`
	};

	const res = await fetch(`${SERVER_BASE_URL}/product/inventory?offset=${offset}&page=${page}`, {
		headers: headerOptions
	});
	const res_data = await res.json();
	return res_data;
};
