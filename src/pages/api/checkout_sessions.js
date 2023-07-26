//This function is used as payment method when a user donates for a cause.
//This creates a stripe session for a the product with hardcoded product id.This is not yet made dynamic for each product.
 

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { productId } = req.query;
			//Create session for the given product id
			const session = await stripe.checkout.sessions.create({
				line_items: [
					{
						price: 'price_1N6nmsBcKerQbAeJvIqifVc5',
						quantity: 1,
					},
				],
				//Use card payment method provided by stripe
				payment_method_types: ['card'],
				mode: 'payment',
				//After the payment is made the page navigates to the success url if unsuccessful it goes to the cancel url.
				success_url: `${req.headers.origin}/thankyou`,
				cancel_url: `${req.headers.origin}/?canceled=true`,
			});
			res.redirect(303, session.url);
		} catch (err) {
			res.status(err.statusCode || 500).json(err.message);
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}