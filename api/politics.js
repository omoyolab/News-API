const express = require("express");
const router = express.Router();
const axios = require('axios')
const politicspapers = require('./../data/politicspapers');
const cheerio = require('cheerio')

const articles = []

politicspapers.forEach(politicspaper => {
    axios.get(politicspaper.address)
        .then(res => {
            const html = res.data
            const $ = cheerio.load(html)

            
                    //Punch NewsPaper
                $('.entry-item-simple', html).each(function () {
                    const title = $(this).find('h3').text()
                    const url = $(this).find('a').attr('href')
                    const time = $(this).find('.js-update-timestamp').attr('data-timestamp')
                    const img = $(this).find('img').attr('data-src')
                    const date = $(this).find('.meta-time').text()
                    articles.push({
                        title,
                        url: politicspaper.base + url,
                        source: politicspaper.name,
                        time,
                        img,
                        date
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
                            url: politicspaper.base + url,
                            source: politicspaper.name,
                            time,
                            img
                        })
                    })

                    
                     //Daily Post
                     $('.mvp-blog-story-wrap', html).each(function () {
                        const title = $(this).find('h2').text()
                        const url = $(this).find('a').attr('href')
                        const img = $(this).find('img').attr('src')
                        articles.push({
                            title,
                            url: politicspaper.base + url, 
                            source: politicspaper.name,
                            img,     
                          
                        })
                    })
                    
                     //The NetNaija
                     $('.post-one', html).each(function () {
                        const title = $(this).find('h2').text()
                        const url = $(this).find('a').attr('href')
                        const img = $(this).find('img').attr('src')
                        articles.push({
                            title,
                            url: politicspaper.base + url, 
                            source: politicspaper.name,
                            img,     
                          
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
