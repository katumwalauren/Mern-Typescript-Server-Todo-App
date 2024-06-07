import express, { Request, Response } from 'express';
import { getConnectedClient } from './database';
import {MongoClient, ObjectId, Collection } from 'mongodb';

const router = express.Router();

const getCollection = async (): Promise<Collection> => {
  const client: MongoClient | undefined = await getConnectedClient();
  if (!client) {
    throw new Error('Failed to get a connected client');
  }
  return client.db("todosdb").collection("todos");
};

router.get("/todos", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/todos", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const { todo } = req.body;
    const newTodo = await collection.insertOne({ todo, status: false });
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const _id = new ObjectId(id);
    const deletedTodo = await collection.deleteOne({ _id });
    res.status(200).json(deletedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/todos/:id", async (req: Request, res: Response) => {
  try {
    const collection = await getCollection();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const _id = new ObjectId(id);
    const { todo } = req.body;
    const existingTodo = await collection.findOne({ _id });
    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    await collection.updateOne({ _id }, { $set: { todo } });
    const updatedData = await collection.findOne({ _id });
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
