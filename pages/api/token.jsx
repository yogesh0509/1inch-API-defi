import fetch from 'node-fetch';

export default async (req, res) => {
  // Define the URL and request headers
  const { query } = req;

  const url = `https://api.1inch.dev/swap/v5.2/${query.chainId}/tokens`
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
      const updatedData = {
        tokens: {}
      };

      for (const token in data.tokens) {
        if (data.tokens.hasOwnProperty(token)) {
          updatedData.tokens[token] = { ...data.tokens[token] }
          delete updatedData.tokens[token].name
          delete updatedData.tokens[token].tags
          delete updatedData.tokens[token].eip2612
        }
      }
      res.status(200).json(updatedData);
    } else {
      res.status(response.status).json({ error: 'Request failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
