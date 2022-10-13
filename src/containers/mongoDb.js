import mongoose from 'mongoose';
import config from '../config/DBconfig.js';
import _loggerW from '../config/winston.js';

(async () => {
	try {
		const db = mongoose.connect(config.mongoRemote.cnxStr, {
			useNewUrlParser: true,
		});
		_loggerW.info(`DB connected, PID = ${process.pid}`);
	} catch (err) {
		_loggerW.error(err);
	}
})();
class mongoContainer {
	constructor(modelSchema) {
		this.model = modelSchema;
	}
	saveNewUser = async (newUser) => {
		const user = new this.model(newUser);
		user.password = await user.encryptPassword(user.password);
		try {
			await user.save();
			_loggerW.info(`Usuario guardado : ${newUser.email}, password encriptado con exito.`);
			return true;
		} catch (err) {
			_loggerW.error(err);
			return err.keyValue;
		}
	};

	becomeAdmin = async (id) => {
		const updateUser = await this.model.findByIdAndUpdate({ _id: id }, { role: 2 });
		_loggerW.info(`Usuario con id ${id} convertido en admin.`);
	};

	deleteProdDB = async (id) => {
		try {
			const deleted = await this.model.deleteOne({ _id: id });
			_loggerW.info(`El producto con id : ${id} fue eliminado.`);
			return true;
		} catch (err) {
			_loggerW.error(err);
			return false;
		}
	};
	updateProdDB = async (id, newData) => {
		try {
			const updateProd = await this.model.replaceOne(
				{ _id: id },
				{
					title: newData.title,
					description: newData.description,
					img: newData.img,
					price: newData.price,
					stock: newData.stock,
				}
			);
			return true;
		} catch (err) {
			_loggerW.info(err);
			return false;
		}
	};

	getOneDoc = async (id) => {
		const product = await this.model.findById({ _id: id });
		_loggerW.info(`Id del producto requerido de la base de datos : ${product._id}`);
		return product;
	};

	listarAll = async () => {
		const products = await this.model.find();
		_loggerW.info('Productos listados para renderizar en home.');
		return products;
	};

	save = async (data) => {
		_loggerW.info(`data recibida ${data.title}`);
		const product = new this.model(data);
		try {
			await product.save();
			_loggerW.info('Producto agregado a la DB por admin.');
			return true;
		} catch (err) {
			_loggerW.error(err);
			return false;
		}
	};

	addProd = async (prod, idUser) => {
		const user = await this.model.findById({ _id: idUser });
		const cart = user.cart;
		const find = cart.find((e) => e._id == prod.id);
		
		if (!find) {
			prod.quantity = 1
			user.cart.push(prod);
		}else{
			find.quantity+=1
		}
		console.log(find)
		
		try {
			user.save();
			_loggerW.info(`Producto agregado al carrito: ${prod.title}`);
		} catch (err) {
			_loggerW.error(err);
		}
	};

	deleteCartProd = async (idProd, userId) => {
		const user = await this.model.findById({ _id: userId });
		_loggerW.info(`Cart : ${userId}, product : ${idProd}`);
		const products = user.cart;
		const find = products.findIndex((e) => e._id == idProd);
		_loggerW.info(`Index del producto encontrado : ${find}`);
		products.splice(find, 1);
		try {
			await this.model.updateOne({ _id: userId }, { $set: { cart: products } });
			_loggerW.info(`Producto con id: ${idProd} fue eliminado`);
		} catch (err) {
			_loggerW.error(err);
		}
	};

	emptyCart = async (userId) => {
		try {
			await this.model.updateOne({ _id: userId }, { $set: { cart: [] } });
			_loggerW.info(`Carrito vaciado`);
		} catch (err) {
			_loggerW.error(err);
		}
	};
}

export default mongoContainer;
