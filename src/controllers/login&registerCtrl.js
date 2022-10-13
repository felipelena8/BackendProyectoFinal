import passport from 'passport';
import userMongoContainer from '../daos/userDao.js';
import { sendEmail, mailOptions } from '../msjs/nodemailer.js';
import _loggerW from '../config/winston.js';
const renderLogin = (req, res) => {
	res.render('login');
};
const postLogin = passport.authenticate('login', {
	failureRedirect: '/user/loginError',
	successRedirect: '/content/home',
	failureFlash: true,
});

const renderRegister = (req, res) => {
	res.render('register');
};

const newUserRegister = async (req, res) => {
	const errors = [];
	const full_phone = req.body.full_phone;
	_loggerW.info(`User name: ${req.body.username}`);
	const { avatar, email, direction, username, lastname, age, password, confirmPsw } = req.body;
	if (password.length < 4) {
		errors.push({ text: 'La contraseña debe contar con 4 o mas caracteres.' });
	}
	if (password != confirmPsw) {
		errors.push({ text: 'Las contraseñas no coinciden.' });
	}
	if (errors.length > 0) {
		res.render('register', {
			errors,
		});
	} else {
		const user = {
			avatar,
			email,
			direction,
			username,
			lastname,
			age,
			password,
			phone: full_phone,
			role: 1,
		};
		const saveUser = await userMongoContainer.saveNewUser(user);
		if (saveUser == true) {
			mailOptions.subject = 'Nuevo registro';
			mailOptions.html = `
  <table>
    <thead>
            <tr>
                <th class="col">avatar</th>
                <th class="col">Email</th>
                <th class="col">Direccion</th>
                <th class="col">userName</th>
                <th class="col">lastname</th>
                <th class="col">age</th>
                <th class="col">phone</th>
                <th class="col">role</th>
            </tr>
        </thead>
    <tr>
		<td><img src="${user.avatar}" width="40" height="40"></td>
      <td>${user.email}</td>
      <td>${user.direction}</td>
      <td>${user.username}</td>
      <td>${user.lastname}</td>
      <td>${user.age}</td>
      <td>${user.phone}</td>
	  <td>${user.role}</td>
    </tr>
    </table>
    `;
			sendEmail(mailOptions);
			res.redirect('/user/login');
		} else {
			req.flash(
				'registerErr',
				`La informacion ingresada ya existe, ingrese otra.`
			);
			res.redirect('/user/register');
		}
	}
};
const loginError = (req, res) => {
	res.render('error');
};
const renderLogout = (req, res) => {
	const user = req.user.username;
	res.render('logout', {
		userLogout: user,
	});
	req.session.destroy();
};
export { renderLogin, postLogin, renderRegister, newUserRegister, loginError, renderLogout };
