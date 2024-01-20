import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { Client } from "@elastic/elasticsearch";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

//elastic connection
const elasticClient = new Client({
  node: 'https://8bc5d3d8fe884626b3fbdb6e3a4a88da.us-central1.gcp.cloud.es.io:443',
  auth: {
      apiKey: process.env.API_KEY
  }
});
const resp = await elasticClient.info();
console.log(resp);
// Let's search!
// const createIndex = async (indexName) => {
//   await elasticClient.indices.create({ index: indexName });
//   console.log("Index created");
// };

// createIndex("events");

//constants
const port = process.env.PORT;
const uri = process.env.URI;
const database_name = process.env.DATABASE_NAME;
//db connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect();
const db = client.db(database_name);

//get all
app.get('/events/getEvents', async (req, res) => {
  const result = await db.collection('events').find({}).toArray((error, result)=> {
    return result;
  });
  res.json(result).status(200);
});
//get by id
app.get('/events/search/id/:id', async (req, res) => {
  const id = req.params.id;
  const result = await db.collection('events').find({id: id}).toArray((error, result)=> {
    return result;
  });
  res.send(result);
});
// get by title from mongodb
app.get('/events/search/keyword1/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  const regex = new RegExp(keyword, 'i');
  const result = await db.collection('events').find({title: { $regex: regex }}).toArray((error, result)=> {
    return result;
  });
  res.send(result).status(200);
});
//get by tile elastic 
app.get('/events/search/keyword/:keyword', async (req, res) => {
  let result = null;
  try {
    result = await elasticClient.search({
      index: "posts",
      query: { fuzzy: { title: req.params.keyword } },
    });
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
  console.log(result.hits[0]);
  res.send(result).status(200);
});
//post methods
//post with elastic
app.post("/events/create/elastic", async (req, res) => {
  let result = null;
  try {
    result = await elasticClient.index({
      index: "posts",
      document: {
        title: req.body.newEvent.title,
        description: req.body.newEvent.description,
        date: req.body.newEvent.date,
        location: req.body.newEvent.location,
        category: req.body.newEvent.category
      },
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
  res.send(result);
});

app.post('/events/create', async (req, res) => {
  const { title, description, date, category, location } = req.body.newEvent;
  const entries = await db.collection('events').find({}).toArray((error, result)=> {
    return result;
  });
  const id = (entries.length + 1).toString();
  await db.collection('events').insertOne({
    id: id,
    title: title,
    description: description,
    date: date,
    location: location,
    category: category
  });
  res.json({id, title, description, date, category, location}).status(200);
});

//update methods
app.put('/events/update/:description/:id', async (req, res) => {
  const { id, description } = req.params;
  const updateEvent = {
    $set: {
      description: description
    },
  };
  await db.collection('events').updateOne({id: id}, updateEvent);
  res.send(id).status(200);
});

//delete methods
app.delete('/events/delete/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await db.collection('events').deleteOne({ id: id });
  res.send({id: id});
});
app.delete('/events/delete', async (req, res) => {
  await db.collection('events').deleteMany({});
  res.sendStatus(200);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})