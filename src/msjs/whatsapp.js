import twilio from 'twilio';
import { config } from 'dotenv';
config();
const accountSid = 'AC6e06ec6554d8c2e5f0a51d4e84cc9082';
const authToken = 'd912a63bc79db2dc4b7557af7a69a78b';

const client = twilio(accountSid, authToken);
const whatsappOptions = {
	body: '',
	from: 'whatsapp:+14155238886',
	to: 'whatsapp:+5491167081366',
};

const sendWhatsapp = async (messageOptions) => {
	try {
		const message = await client.messages.create(messageOptions);
		console.log(message);
	} catch (error) {
		console.log(error);
	}
};
export { whatsappOptions, sendWhatsapp };
