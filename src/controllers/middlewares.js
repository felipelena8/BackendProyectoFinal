const checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/user/login');
	}
};
const checkAdmin = (req, res, next) => {
	if (req.user.role == 2) {
		next();
	} else {
		const notAdmin = 'No tiene autorizacion para acceder a la pagina solicitada.';
		res.render('error', {
			notAdmin,
		});
	}
};
export { checkAuthentication, checkAdmin };
