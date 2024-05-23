import { SERVER_BASE_URL } from '$env/static/private';
import type { DataInventory } from '$lib/types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
  const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const fetchInventory = async (): Promise<DataInventory> => {
	  const headerOptions = {
      Authorization: `Bearer ${token}`,
    };
		const res = await fetch(`${SERVER_BASE_URL}/product/inventory?offset=${offset}&page=${page}`, {headers: headerOptions,});
		const res_data = await res.json();
		return res_data;
	};

	const receivedInventory = await fetchInventory();
	return {
		inventory: receivedInventory,
		page: receivedInventory.page,
		offset: receivedInventory.offset,
		totalPages: receivedInventory.total_pages,
		totalRecords: receivedInventory.total_records
	};
};

