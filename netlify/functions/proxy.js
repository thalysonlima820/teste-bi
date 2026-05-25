export async function handler(event) {
  const path = event.path.replace('/.netlify/functions/proxy', '');

  const url = `https://5f2f-51-79-105-93.ngrok-free.app/adm${path}`;

  const token =
    event.headers.admgestao ||
    event.headers.Admgestao ||
    event.headers.ADMGESTAO ||
    '';

  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        admgestao: token,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
      body: event.httpMethod === 'GET' ? undefined : event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: data,
    };
  } catch (err) {
    console.log('ERRO PROXY:', err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'erro proxy' }),
    };
  }
}