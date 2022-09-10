import { ObjectId } from "mongodb";

export default class Event {
    constructor(public title?: string, public date?: Date, public userIds?: string[], public id?: ObjectId) {}
}