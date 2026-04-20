const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://mail.360.yandex.ru/?uid=1130000067136437#/inbox');
    await page.screenshot({path: 'img.png'});

    await browser.close();
})()