const puppeteer = require('puppeteer')


const getDetails= async (url)=>{
    const browser = await puppeteer.launch({
        headless:true,
        args:["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.waitForSelector('.listing')
    const result  = await page.evaluate(()=>{
        const title = document.querySelector('.bigChar').textContent
        const status  = document.querySelector('#spanBookmark').parentElement.textContent.trim().split('Views')[0].split('Status:')[1].trim()
        const episodes = document.querySelectorAll('td a').length
        return {
            'title': title,
            'status':status,
            'episodes':episodes
        }
    })
    browser.close()
    return result
}


module.exports.getDetails = getDetails