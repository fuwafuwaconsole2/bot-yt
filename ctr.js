const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const urls = require('./url2.json');

puppeteer.use(pluginStealth());

const start = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Starting..');
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const pages = await browser.pages();
            pages[0].close();

            for (const urlObj of urls) {
                const page = await browser.newPage();
                await page.goto(urlObj.data);
                console.log(`Opening... ${urlObj.data}`)
                await page.keyboard.press('Tab');
                await page.click('.yt-core-image');
                await page.keyboard.press('Enter');
                await new Promise(r => setTimeout(r, 30000)); // Wait for 30 seconds
                await page.close();
            }

            await browser.close();
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const runContinuously = () => {
    start()
        .then(() => {
            console.log("Finished opening all URLs");
            runContinuously();
        })
        .catch((err) => {
            console.error("Error: ", err);
            setTimeout(runContinuously, 60000);
        });
}

runContinuously();
