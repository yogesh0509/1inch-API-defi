import fetch from 'node-fetch';

export default async (req, res) => {
    // Define the URL and request headers
    const { query } = req;

    const url = `https://api.1inch.dev/gas-price/v1.4/${query.chainId}`
    const headers = {
        'accept': 'application/json',
        'Authorization': process.env.NEXT_PUBLIC_1INCH_AUTHORIZATION,
    }

    try {
        // Make a GET request using the fetch API
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            // Parse the response as JSON and send it as the API response
            const data = await response.json();
            res.status(200).json(data.medium.maxFeePerGas);
        } else {
            res.status(response.status).json({ error: 'Request failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
