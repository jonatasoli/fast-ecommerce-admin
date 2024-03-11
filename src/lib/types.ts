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