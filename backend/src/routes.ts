import {StoryController} from "./controllers/StoryController";

export const Routes = [{
    method: "get",
    route: "/stories",
    controller: StoryController,
    action: "index"
}, {
    method: "get",
    route: "/stories/:id",
    controller: StoryController,
    action: "show"
}, {
    method: "post",
    route: "/stories.json",
    controller: StoryController,
    action: "create"
}, {
    method: "delete",
    route: "/stories/:id",
    controller: StoryController,
    action: "destroy"
}];