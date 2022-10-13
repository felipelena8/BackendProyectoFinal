import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		img: { type: String, required: true },
		price: { type: Number, required: true },
		stock: { type: Number, required: true },
		quantity: { type: Number },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const productModel = mongoose.model('Product', productSchema);

export { productSchema, productModel };
