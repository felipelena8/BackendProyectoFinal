import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userModel } from '../../models/userSchema.js';
import mongoContainer from '../daos/userDao.js';
import _loggerW from '../config/winston.js';

passport.use(
	'login',
	new LocalStrategy(
		{
			//El string 'login' permite llamar a la estrategia que declaramos a continuacion
			usernameField: 'user',
			passwordField: 'password',
		},
		async (userEmail, password, done) => {
			
			_loggerW.info('Usuario hallado en DB');
			const user = await userModel.findOne({ email: userEmail });
			console.log(user)
			if (!user) {
				_loggerW.error('usuario no encontrado');
				return done(null, false, {
					message: `Usuario con nombre ${userEmail} no encontrado.`,
				});
			} else {
				if (user.role == 1 && userEmail == 'felipelena8@gmail.com') {
					mongoContainer.becomeAdmin(user._id);
				}
				const match = await user.matchPassword(password);
				if (match) {
					_loggerW.info('El usuario fue autenticado');
					return done(null, user);
				} else {
					return done(null, false, { message: 'Contraseña incorrecta.' });
				}
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	userModel.findById(id, (err, user) => {
		done(err, user);
	});
});

export default {
	passport,
};
