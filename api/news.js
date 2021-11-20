const express = require("express");
const router = express.Router();
const axios = require('axios')
const newspapers = require('./../data/newspapers');
const cheerio = require('cheerio')

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
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
                        url: newspaper.base + url,
                        source: newspaper.name,
                        time,
                        img
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
                            url: newspaper.base + url,
                            source: newspaper.name,
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
                            url: newspaper.base + url,
                            source: newspaper.name,
                            img
                          
                        })
                    })
                    //Premium Times
                    $('.jeg_post', html).each(function () {
                        const title = $(this).find('h3').text()
                        const url = $(this).find('a').attr('href')
                        const img = $(this).find('img').attr('data-src')
                        const time = $(this).find('.jeg_meta_date').text()
                        articles.push({
                            title,
                            url: newspaper.base + url,
                            source: newspaper.name,
                            img,
                            time
                          
                        })
                    })

                     //The Cable NG
                     $('.article-big-block, .article-small-block', html).each(function () {
                        const title = $(this).find('h2').text()
                        const url = $(this).find('a').attr('href')
                        const img = $(this).find('.icon-block').find('a').attr('href')
                        articles.push({
                            title,
                            url: newspaper.base + url,
                            source: newspaper.name,
                            img,
                           
                          
                        })
                    })

                    //NAN News
                    $('.archive-list-post', html).each(function () {
                        const title = $(this).find('h4').text()
                        const url = $(this).find('a').attr('href')
                        const img = $(this).find('img').attr('src')
                        const time = $(this).find('.posts-date').text()
                        articles.push({
                            title,
                            url: newspaper.base + url,
                            source: newspaper.name,
                            img,
                            time
                           
                          
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
