import {NextFunction, Request, Response} from "express";
import * as cheerio from 'cheerio'
import axios from 'axios'

export class StoryController {

    async index(request: Request, response: Response, next: NextFunction) {
        console.log('controller')
        return "CREATE STORY"
    }

    async show(request: Request, response: Response, next: NextFunction) {
        console.log('controller')
        return "CREATE STORY"
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const story = await axios.get(request.body.story_url)
        console.log(story)
        console.log(cheerio)
        try{
            const $ = cheerio.load(story.data)
            const data = {
                storyTitle: $('#profile_top .xcontrast_txt').first().text(),
                authorName: $('#profile_top .xcontrast_txt').eq(2).text(),
                storyDescription: $('#profile_top div.xcontrast_txt').text(),
                storyInformation: $('#profile_top span.xgray.xcontrast_txt').text().replace(/\s{2,}/g, ' '),
                content: $.html('#storytext')
            }
            console.log(data)
            return data 
            } catch(error) {
            console.log(error)
            }
        return "CREATE STORY"
    }

    async destroy(request: Request, response: Response, next: NextFunction) {
        console.log('controller')
        return "CREATE STORY"
    }
}