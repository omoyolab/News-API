const express = require("express");
const router = express.Router();
const axios = require('axios')
const entertainmentPapers = require('./../data/entertainmentpapers');
const cheerio = require('cheerio')

const articles = []

entertainmentPapers.forEach(entertainmentPaper => {
    axios.get(entertainmentPaper.address)
        .then(res => {
            const html = res.data
            const $ = cheerio.load(html)

                //Linda Ikeji
                $('.story_block', html).each(function () {
                    const title = $(this).find('.story_title').text()
                    const url = $(this).find('a').attr('href')
                    const img = $(this).find('img').attr('src')
                    const time = $(this).find('.post_age').text()
                    articles.push({
                        title,
                        url: entertainmentPaper.base + url,
                        source: entertainmentPaper.name,
                        img,
                        time
                    })
                })

                  //Legit NG
                  $('.c-article-card-no-border,.c-article-card-horizontal', html).each(function () {
                    const title = $(this).find('a').text()
                    const url = $(this).find('a').attr('href')
                    const time = $(this).find('.c-article-info__time').attr('datetime')
                    const img = $(this).find('img').attr('src')
                    articles.push({
                        title,
                        url: entertainmentPaper.base + url,
                        source: entertainmentPaper.name,
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
