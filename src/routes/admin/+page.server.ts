export const load = async ({ cookies }) => {
	const token = cookies.get('access_token');
	const role = cookies.get('role');

	return {
		token,
		role
	};
};
