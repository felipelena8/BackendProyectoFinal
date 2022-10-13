import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { productSchema } from './productsSchema.js';

const userSchema = new mongoose.Schema({
	avatar: { type: String, unique: false },
	email: { type: String, required: true, unique: true },
	direction: { type: String, required: true, unique: false },
	username: { type: String, required: true, unique: false },
	lastname: { type: String, required: true, unique: false },
	age: { type: Number, required: true, unique: false },
	phone: { type: Number, required: true, unique: true },
	password: { type: String, required: true, unique: false },
	role: { type: Number, required: true, unique: false },
	cart: [productSchema],
});

userSchema.methods.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};
userSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', userSchema);

export { userModel, userSchema };
