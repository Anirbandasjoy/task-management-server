const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const uri = process.env.dbURL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const taskCollection = client.db("task-management").collection("task");
    // create task create api
    app.post("/api/v1/create-task", async (req, res) => {
      try {
        const taskData = req.body;
        console.log(taskData);
        if (!taskData || Object.keys(taskData).length === 0) {
          return res
            .status(400)
            .json({ message: "Bad Request - Task data missing" });
        }

        const result = await taskCollection.insertOne(taskData);
        res.status(201).send({ message: "Task created successfully", result });
      } catch (error) {
        console.error("Error creating task:", error);
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    });

    // find todo list data

    app.get("/api/v1/todolist/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const status = req.query.status;
        console.log({ email, status });
        const filter = { email: email, status: status };
        const result = await taskCollection.find(filter).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
