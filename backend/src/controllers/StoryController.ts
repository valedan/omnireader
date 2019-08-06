import {NextFunction, Request, Response} from "express";

export class StoryController {

    async create(request: Request, response: Response, next: NextFunction) {
        console.log('controller')
        return "CREATE STORY"
    }

}