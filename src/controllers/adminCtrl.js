import productMongoContainer from '../daos/productsDao.js';
import _loggerW from '../config/winston.js';

const renderAddProds = (req, res) => {
	res.render('addProds');
};
const adminAddProds = async (req, res) => {
	const prod = req.body;
	_loggerW.info(JSON.stringify(prod));
	const addedProd = await productMongoContainer.save(prod);
	if (addedProd) {
		req.flash('adminAlert', 'Producto creado con exito.');
	} else {
		req.flash('adminErrAlert', 'Ocurrio un error al eliminar el producto.');
	}
	res.redirect('/admin/addProds');
};
const adminDeleteProd = async (req, res) => {
	const id = req.params.id;
	const deleteProd = await productMongoContainer.deleteProdDB(id);
	if (deleteProd) {
		req.flash('adminAlert', 'Producto eliminado de la DB con éxito.');
	} else {
		req.flash('adminErrAlert', 'Error al eliminar el producto.');
	}
	res.redirect('/content/home');
};

const renderUpdate = async (req, res) => {
	const idProd = req.params.id;
	const currentProd = await productMongoContainer.getOneDoc(idProd);
	const updateTitle = `Actualizar producto con id ${idProd}`;
	res.render('updateProds', { idProd, updateTitle, currentProd });
};

const adminUpdateProd = (req, res) => {
	const idProd = req.params.id;
	const updatedProd = req.body;
	const updated = productMongoContainer.updateProdDB(idProd, updatedProd);
	if (updated) {
		req.flash('adminAlert', 'Producto actualizado con exito');
	} else {
		req.flash('adminErrAlert', 'Error al actualizar el producto.');
	}
	res.redirect(`/admin/updateProd/${idProd}`);
};
export { renderAddProds, adminAddProds, adminDeleteProd, renderUpdate, adminUpdateProd };
