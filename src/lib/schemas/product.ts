import { z } from 'zod';

export const productEdit = z.object({
	product_id: z.number(),
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	sku: z.string().min(3, 'SKU deve ter no mínimo 3 caracteres'),
	price: z.number().refine((v) => v > 0, { message: 'Preço deve ser maior que 0' }),
	active: z.boolean(),
	showcase: z.boolean(),
	feature: z.boolean(),
	show_discount: z.boolean(),
	category_id: z.string().optional(),
	image_path: z.string().optional(),
	image: z.instanceof(File).optional(),
	content: z.string().optional(),
	howToUse: z.string().optional(),
	composition: z.string().optional(),
	weight: z.number().optional(),
	height: z.number().optional(),
	width: z.number().optional(),
	diameter: z.number().optional(),
	length: z.number().optional(),
	images: z
		.array(
			z.instanceof(File).refine(
				(file) => {
					// Verificando se é imagem ou vídeo
					const fileType = file.type;
					return fileType.startsWith('image/') || fileType.startsWith('video/');
				},
				{ message: 'Arquivo deve ser uma imagem ou vídeo' }
			)
		)
		.optional()
});

export const productSchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	sku: z.string().min(3, 'SKU deve ter no mínimo 3 caracteres'),
	price: z.number().refine((v) => v > 0, { message: 'Preço deve ser maior que 0' }),
	active: z.boolean(),
	showcase: z.boolean(),
	feature: z.boolean(),
	show_discount: z.boolean(),
	category: z.string().min(1, 'Categoria é obrigatória'),
	image_path: z.string().optional(),
	image: z.instanceof(File).optional(),
	content: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
	howToUse: z.string().optional(),
	composition: z.string().optional(),
	weight: z.number().optional(),
	height: z.number().optional(),
	width: z.number().optional(),
	diameter: z.number().optional(),
	length: z.number().optional()
});

export type ProductSchema = z.infer<typeof productSchema>;
