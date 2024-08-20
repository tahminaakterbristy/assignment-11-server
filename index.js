const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 7000;

app.use(cors());
app.use (express.json());

console.log(process.env.DB_Pass)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb7zkyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const FoodDetails = client.db('FoodDonation').collection('Details');

    app.get('/foods', async(req,res)=>{
      const cursor = FoodDetails.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);

    })

    app.get(`/details/:id`, async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await FoodDetails.findOne(query);
      res.send(result);
    })

    app.get('/details/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}

      const options ={
        projection: {_id: 0, FoodName: 1, pickupLocation:1, expirtDateTime:1}
      };
      const result = await FoodDetails.findOne(query,options);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('doctor is running')
})

app.listen(port,()=>{
    console.log(`Car is running ${port}`)
})