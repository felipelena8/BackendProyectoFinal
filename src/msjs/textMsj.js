import twilio from 'twilio';

import { config } from 'dotenv';
config();

const accountSid = 'AC6e06ec6554d8c2e5f0a51d4e84cc9082';
console.log(process.env.TWILIOTOKEN)
const authToken = process.env.TWILIOTOKEN

const client = twilio(accountSid, authToken);

const messageTextOptions = {
	body: 'Se recibio su pedido',
	from: '+12057518642',
	to: '+',
};

const sendTextMessage = async (messageOptions) => {
	try {
		const message = await client.messages.create(messageOptions);
		console.log(message);
	} catch (error) {
		console.log(error);
	}
};

export { messageTextOptions, sendTextMessage };
