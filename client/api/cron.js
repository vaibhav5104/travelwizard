export default function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  // Your cron job logic
  console.log("Cron job executed");

  res.status(200).end('Hello Cron!');
}
