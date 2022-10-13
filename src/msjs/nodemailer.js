import { createTransport } from 'nodemailer';

const transporter = createTransport({
	service: 'gmail',
	port: 587,
	auth: {
		user: 'cfelipe2704@gmail.com',
		pass: 'ugzznwdktugyqyhz',
	},
});

const mailOptions = {
	from: 'Servidor Node.js',
	to: 'cfelipe2704@gmail.com',
	subject: '',
	html: '',
};

const sendEmail = async (options) => {
	try {
		const info = await transporter.sendMail(options);
		console.log(info);
	} catch (error) {
		console.log(error);
	}
};
export { mailOptions, sendEmail };
