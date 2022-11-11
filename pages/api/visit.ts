const puppeteer = require('puppeteer');
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const { url } = query;

  const imageName = `screenshot_${String(url).split(".")[0].replace("http://", "")}.png`;

    const browser = await puppeteer.launch({
        timeout: 0,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

  try {
      const page = await browser.newPage();
      await page.goto(String(url));

      page.setViewport({ width: 1024, height: 720 })
      const buffer = await page.screenshot({ path: imageName });
      const image64 = buffer.toString("base64");
      
      res.status(200).json({ data: image64 });
      await browser.close(); 
  } catch (err) {
      console.log(err);
      await browser.close(); 
      res.status(500).json({ data: "", message: err });
  }
}
