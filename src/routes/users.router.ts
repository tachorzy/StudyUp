import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Event from "../models/Event";

export const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const events = (await collections.events?.find({}).toArray()) as Event[];

        res.status(200).send(events);
    } catch (error) {
        res.status(500).send('An error has occured.');
        //res.status(500).send(error.message);
    }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        const events = (await collections.events?.findOne(query)) as Event;

        if (events) {
            res.status(200).send(events);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});


usersRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as Event;
        const result = await collections.events?.insertOne(newGame);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(500).send('An error has occured.');
        //res.status(400).send(error.message);
    }
});

usersRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedGame: Event = req.body as Event;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.events?.updateOne(query, { $set: updatedGame });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error('An error has occured.');
        res.status(400).send('An error has occured.');
        //console.error(error.message);
        //res.status(400).send(error.message);
    }
});

usersRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.events?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error('An error has occured.');
        res.status(400).send('An error has occured.');
        //console.error(error.message);
        //res.status(400).send(error.message);
    }
});
