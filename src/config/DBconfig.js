import { config } from 'dotenv';
config();
export default {
	PORT: process.env.PORT || 3000,
	mongoRemote: {
		client: 'mongodb',
		cnxStr: process.env.DB
	},
};
