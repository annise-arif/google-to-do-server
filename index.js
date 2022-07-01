const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const query = require("express/lib/middleware/query");
const port = process.env.PORT || 5000;

// midle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1zono.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  await client.connect();
  const todoCollection = client.db("google_todo").collection("todo");

  app.post("/todo", async (req, res) => {
    try {
      const order = req.body;
      const result = await todoCollection.insertOne(order);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/todo", async (req, res) => {
    try {
      const query = {};
      const cursor = todoCollection.find(query);
      const todo = await cursor.toArray();
      res.send(todo);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put("/todo/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: { role: "completed" },
      };
      const result = await todoCollection.updateOne(filter, updatedDoc);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/todo/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const Id = await todoCollection.find({ _id: ObjectId(id) });
      const isCompleted = user.role === "completed";
      res.send({ Completed: isCompleted });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.listen(port, () => {
    console.log(`google todo server listening on port ${port}`);
  });
}

run().catch(console.dir);
