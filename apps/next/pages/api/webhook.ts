export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log(JSON.stringify(req.body));
    return res.status(200).json({ name: 'ok' });
  }

  if (req.method === 'GET') {
    res.status(200).json({ name: 'test' });
  }
}
