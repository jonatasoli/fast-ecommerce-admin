export interface Product {
	product_id: number;
	name: string;
	image_path: string;
	quantity: number;
	price: number;
	active: boolean;
	category_id: number;
}

export interface DataProducts {
	products: Product[];
	page: number;
	offset: number;
	total_records: number;
	total_pages: number;
}

export interface Category {
	category_id: number;
	name: string;
	path: string;
	menu: boolean;
	showcase: boolean;
	image_path: string;
}

export interface DataInventory {
	inventory_id: number;
	product_id: string;
	product_name: string;
	order_id: number;
	quantity: number;
	operation: string;
	create_at: Date;
}

export interface Comissions {
	order_id: number;
	user_id: number;
	commission: string;
	date_created: Date;
	release_date: Date;
	released: boolean;
	paid: boolean;
}

export type User = {
	user_id: number | null;
	name: string;
	email: string;
	document: string;
	phone: string;
};

export interface OrderItem {
	order_id: number;
	affiliate_id: any;
	user: User;
	customer_id: string;
	order_date: string;
	discount: string;
	tracking_number: any;
	order_status: string;
	freight: string;
	coupon_id: any;
}
export interface DataOrders {
	orders: OrderItem[];
	page: number;
	offset: number;
	total_pages: number;
	total_records: number;
}

export interface Items {
	selectedCode: string;
	base_url: string;
	token_access: string;
}

export interface CdnConfig {
	provider: string;
	value: {
		url: string;
		region: string;
		bucket_name: string;
		api_key: string;
		secret_key: string;
	};
	locale: string;
	description: string;
	is_default: boolean;
	field: string;
	settings_id: number;
	is_active: boolean;
}

export interface OrderTracking {
	order_id: number;
	order_date: string;
	tracking_number: any;
	order_status: string;
}

export interface SelectedUser {
	user_id: number;
	name: string;
	document: string;
	phone: string;
	role_id: number;
	email: string;
	full_name: any;
	disabled: any;
}

export interface CrmSettings {
	provider: string;
	value: {
		provider: string;
		field: string;
		description: string;
		access_key: string;
		url: string;
		deal_stage_id: string;
		deal_stage_name: string;
	};
	locale: string;
	description: string;
	is_default: boolean;
	field: string;
	settings_id: number;
	is_active: boolean;
}

export interface CompanySettings {
	provider: string;
	value: {
		provider: string;
		field: string;
		description: string;
		name: string;
	};
	locale: string;
	description: string;
	is_default: boolean;
	settings_id: number;
	field: string;
	is_active: boolean;
}

export interface LogisticsConfig {
	provider: string;
	locale: string;
	description: string;
	is_active: boolean;
	is_default: boolean;
	settings_id: number;
	field: string;
	value: {
		name: string;
		logistics_user: string;
		logistics_pass: string;
		logistics_api_secret: string;
		logistics_postal_card: string;
		zip_origin: string;
	};
}

export interface NotificationSettings {
	provider: string;
	value: {
		api_key: string;
		contact: string;
		secret_key: string;
		type: string;
	};
	locale: string;
	description: string;
	is_default: boolean;
	settings_id: number;
	field: string;
	is_active: boolean;
}

export interface PaymentGatewayConfig {
	provider: string;
	value: {
		gateway_name: string;
		gateway_url: string;
		gateway_key: string;
		gateway_secret_key: string;
	};
	locale: string;
	description: string;
	is_default: boolean;
	settings_id: number;
	field: string;
	is_active: boolean;
}
