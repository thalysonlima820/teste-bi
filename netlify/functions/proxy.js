export async function handler(event) {
  const path = event.path.replace('/.netlify/functions/proxy', '')

  const url = `https://6978-51-79-105-93.ngrok-free.app/adm${path}`

  try {
    const response = await fetch(url)

    const data = await response.text()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    }
  } catch (err) {
    console.log('ERRO PROXY:', err)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'erro proxy' }),
    }
  }
}