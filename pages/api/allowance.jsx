import fetch from 'node-fetch';

export default async (req, res) => {
    // Define the URL and request headers
    const { query } = req;

    const baseUrl = `https://api.1inch.dev/swap/v5.2/${query.chainId}/approve/allowance`
    const headers = {
        'accept': 'application/json',
        'Authorization': process.env.NEXT_PUBLIC_1INCH_AUTHORIZATION,
    };

    try {
        const response = await fetch(`${baseUrl}?tokenAddress=${query.tokenAddress}&walletAddress=${query.walletAddress}`, {
            method: 'GET',
            headers: headers,
        });
        if (response.ok) {
            // Parse the response as JSON and send it as the API response
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: 'Request failed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
