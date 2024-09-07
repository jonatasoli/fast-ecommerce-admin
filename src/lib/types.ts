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
