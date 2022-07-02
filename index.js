const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const query = require("express/lib/middleware/query");
const port = process.env.PORT || 5000;


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
  const CompletedTodoCollection = client.db("google_todo").collection("completedTodo");

  app.post("/todo", async (req, res) => {
    try {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/CompletedTodo", async (req, res) => {
    try {
      const todo = req.body;
      const result = await CompletedTodoCollection.insertOne(todo);
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

  app.get("/CompletedTodo", async (req, res) => {
    try {
      const query = {};
      const cursor = CompletedTodoCollection.find(query);
      const todo = await cursor.toArray();
      res.send(todo);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.delete("/todo/:id", async (req, res) => {
    try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await todoCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
  });

  app.put("/todo/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: { todo },
      };
      const result = await todoCollection.updateOne(filter, updatedDoc);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });


  app.listen(port, () => {
    console.log(`google todo server listening on port ${port}`);
  });
}

run().catch(console.dir);
