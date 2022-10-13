import userMongoContainer from '../daos/userDao.js';
import productMongoContainer from '../daos/productsDao.js';
import { sendEmail, mailOptions } from '../msjs/nodemailer.js';
import { sendWhatsapp, whatsappOptions } from '../msjs/whatsapp.js';
import { messageTextOptions, sendTextMessage } from '../msjs/textMsj.js';
import _loggerW from '../config/winston.js';

const renderHomePage = async (req, res) => {
	const products = await productMongoContainer.listarAll();
	if (req.user.role == 2) {
		const admin = req.user.role;
		res.render('index', {
			admin,
			products,
		});
	} else {
		res.render('index', {
			products,
		});
	}
};

const renderUserProfile = (req, res) => {
	const { avatar, email, direction, username, lastname, age, phone } = req.user;
	res.render('profile', {
		avatar,
		email,
		direction,
		username,
		lastname,
		age,
		phone,
	});
};

const renderCart = async (req, res) => {
	const userId = req.user.id;
	const userDoc = await userMongoContainer.getOneDoc(userId);
	const cart = userDoc.cart;
	res.render('cart', {
		cart,
		userId,
	});
};

const addProductsToCart = async (req, res) => {
	const prodId = req.params.id;
	const prodDoc = await productMongoContainer.getOneDoc(prodId);
	const userId = req.user.id;
	console.log(prodDoc)
	userMongoContainer.addProd(prodDoc, userId);
	req.flash('addCartProduct', 'Producto agregado al carrito.');
	res.redirect('/content/home');
};

const removeProduct = async (req, res) => {
	const prodId = req.params.id;
	const userId = req.user.id;
	userMongoContainer.deleteCartProd(prodId, userId);
	req.flash('deleteProd', 'Producto eliminado.');
	res.redirect('/content/cart');
};

const purchasedCart = async (req, res) => {
	
	const userId = req.user.id;
	const userDoc = await userMongoContainer.getOneDoc(userId);
	const { cart, email, username, phone } = userDoc;
	if(!cart.length){
		return res.redirect('/content/home')
	}
	const subject = `Nuevo pedido de nombre ${username}, email: ${email}. `;
	mailOptions.subject = subject;
	for (const product of cart) {
		mailOptions.html += `
        <ul>
          <li>Nombre del producto: ${product.title}, Precio: $${product.price}, Cantidad: ${product.quantity}</li>
        </ul>
      `;
	}
	sendEmail(mailOptions);
	_loggerW.info('Email enviado');
	whatsappOptions.body = subject;
	sendWhatsapp(whatsappOptions);
	messageTextOptions.body = 'Su pedido se ha confirmado y esta siendo procesado.';
	messageTextOptions.to += phone;
	_loggerW.info(`MessageOptions ${messageTextOptions}`);
	sendTextMessage(messageTextOptions);
	userMongoContainer.emptyCart(userId);
	req.flash('cartAlert', 'Pedido realizado, gracias por su compra!');
	res.redirect('/content/cart');
};

const emptyCart = async (req, res) => {
	const userId = req.user.id;
	userMongoContainer.emptyCart(userId);
	req.flash('cartAlert', 'Su carrito se vació con exito');
	res.redirect('/content/cart');
};

export {
	renderHomePage,
	renderUserProfile,
	renderCart,
	addProductsToCart,
	removeProduct,
	purchasedCart,
	emptyCart,
};
