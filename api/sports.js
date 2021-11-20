const express = require("express");
const router = express.Router();
const axios = require('axios')
const sportPapers = require('./../data/sportspapers');
const cheerio = require('cheerio')

const articles = []

sportPapers.forEach(sportPaper => {
    axios.get(sportPaper.address)
        .then(res => {
            const html = res.data
            const $ = cheerio.load(html)

                    //Punch NewsPaper
                    $('.entry-item-simple', html).each(function () {
                        const title = $(this).text()
                        const url = $(this).find('a').attr('href')
                        const time = $(this).find('.js-update-timestamp').attr('data-timestamp')
                        const img = $(this).find('img').attr('data-src')
                        articles.push({
                            title,
                            url: sportPaper.base + url,
                            source: sportPaper.name,
                            time,
                            img
                        })
                    })

            
                

        })
        .catch(err => { })
})

router.get('/', (req, res) => {
    let { keywords } = req.query;
    keywords = keywords ? keywords.toLowerCase().split(' ') : [];

    if (keywords.length === 0) {
        return res.json(articles);
    }

    const filteredArticles = articles
        .filter(a => keywords.some(k => a.title.toLowerCase().includes(k)))

    return res.json(filteredArticles)
});


module.exports = router;
