const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
require("dotenv").config();
//middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ovqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    //POST API
    const database = client.db("greenFlagTourism");
    const services = database.collection("services");
    const orders = database.collection("orders");
    const visaServices = database.collection("visaServices");

    //POST API
    app.post("/orders", async (req, res) => {
      const data = req.body;
      const result = await orders.insertOne(data);
      res.send(result);
    });

    //GET API
    app.get("/services", async (req, res) => {
      const cursor = services.find({});
      const servicesData = await cursor.toArray();
      res.send(servicesData);
    });

    app.get("/visaservices", async (req, res) => {
      const cursor = visaServices.find({});
      const visaServicesData = await cursor.toArray();
      res.send(visaServicesData);
    });

    app.post("/services", async (req, res) => {
      const data = req.body;
      const result = await services.insertOne(data);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const cursor = orders.find({});
      const allOrders = await cursor.toArray();
      res.send(allOrders);
      //  console.log('hitting orders');
    });

    app.delete("/orders/:Id", async (req, res) => {
      const id = req.params.Id;
      const query = { _id: ObjectId(id) };
      const result = await orders.deleteOne(query);
      res.send(result);
    });
//PUT API
 app.put('/orders/:Id', async(req, res)=>{
   const id=req.params.Id;
   const filter={_id:ObjectId(id)}
   const option={upsert:true}
   const updateDoc={
     $set:{
       status:true
     }
   }
   const result = await orders.updateOne(filter, updateDoc, option);
   res.send(result)
 })

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("All is ok");
});

app.listen(port, () => {
  console.log("server is running on port ", port);
});
