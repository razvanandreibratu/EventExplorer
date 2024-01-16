import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

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
// get by title
app.get('/events/search/keyword/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  const regex = new RegExp(keyword, 'i');
  const result = await db.collection('events').find({title: { $regex: regex }}).toArray((error, result)=> {
    return result;
  });
  res.send(result).status(200);
});

//post methods
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
  // res.send({id, title, description, date, category, location});
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