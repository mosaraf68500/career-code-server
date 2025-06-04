const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT||3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nobizgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const jobCollection=client.db('carrerCode').collection('jobs');
    const applicaitonsCollection=client.db('carrerCode').collection('apply');

    // api
    app.get("/jobs",async(req,res)=>{

        const email=req.query.email;
        const query={};
        if(email){
            query.hr_email=email
        }
        const cursor=jobCollection.find();
        const result =await cursor.toArray();
        res.send(result);

    })

    app.post("/jobs",async(req,res)=>{
        const jobs=req.body;
        const result=await jobCollection.insertOne(jobs);
        res.send(result);
    })


    app.get("/jobs/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await jobCollection.findOne(query);
        res.send(result)
    })



    // appliction apis
    app.post("/applications",async(req,res)=>{
        const appliction=req.body;
        const result=await applicaitonsCollection.insertOne(appliction);
        res.send(result);
    })

    app.get("/applications",async(req,res)=>{
        const cursor=applicaitonsCollection.find();
        const result=await cursor.toArray();
        res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally { 
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("career code is running!")
})

app.listen(port,()=>{
    console.log(`carrer code is runngin on port:${port}`);
})