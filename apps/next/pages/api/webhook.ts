export default function handler(req, res) {
  console.log(req.body);
  res.status(200).json({ name: 'get webhooks n stuff test' });
}
