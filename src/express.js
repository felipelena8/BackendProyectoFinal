import express from 'express';
const { Router } = express;
import http from 'http';

import cluster from 'cluster';
import { cpus } from 'os';

import userRouter from './routers/user.routes.js';
import contentRouter from './routers/content.routes.js';
import adminRouter from './routers/admin.routes.js';

import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoStore from 'connect-mongo';
import passportFile from './business/passport.js';
import passport from 'passport';

import flash from 'connect-flash';

import _loggerW from './config/winston.js';

import { config } from 'dotenv';
config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//SET COOKIES
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(cookieParser());
app.use(
	session({
		store: mongoStore.create({
			mongoUrl: `${process.env.DB||"mongodb+srv://felipelena:felipelena@proyecto-final-costa.thlofth.mongodb.net/?retryWrites=true&w=majority"}`,
			mongoOptions: advancedOptions,
		}),
		secret: 'shhhh',
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: 600000,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.error = req.flash('error');
	res.locals.registerErr = req.flash('registerErr');
	res.locals.addCartProduct = req.flash('addCartProduct');
	res.locals.deleteProd = req.flash('deleteProd');
	res.locals.cartAlert = req.flash('cartAlert');
	res.locals.adminAlert = req.flash('adminAlert');
	res.locals.adminErrAler = req.flash('adminErrAlert');
	next();
});

//SET HBS
import { engine as expHbs } from 'express-handlebars';
import { engineConf, publicPath, views } from '../public/configHbs.js';
app.use(express.static(publicPath));
app.engine('.hbs', expHbs(engineConf));
app.set('view engine', '.hbs');
app.set('views', views);

const welcomeRouter = Router();

welcomeRouter.get('/', (req, res) => {
	res.render('welcome');
});

//SET CLUSTER
const clusterMode = process.argv[2] == 'CLUSTER';
const numCPUs = cpus().length;

if (clusterMode && cluster.isPrimary) {
	_loggerW.info(`Num CPUs = ${numCPUs}`);
	_loggerW.info(`PID MASTER = ${process.pid}`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker) => {
		_loggerW.info('Worker', worker.process.pid, 'died', new Date().toLocaleString());
		cluster.fork();
	});
} else {
	const PORT = process.env.PORT || 5000;
	app.use('/', welcomeRouter);
	app.use('/content', contentRouter);
	app.use('/user', userRouter);
	app.use('/admin', adminRouter);
	app.use('*',(req,res)=>{
		return res.send("La ruta indicada no existe")
	})
	server.listen(PORT, () => {
		_loggerW.info(`Se inicio el server en el puerto: ${PORT}, PID = ${process.pid}`);
	});
	server.on('error', (error) => {
		_loggerW.error(error);
	});
}
