const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfi51le.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const flowringCollection = client.db('ankur-nursary').collection('flowrings');
        const medicinalCollection = client.db('ankur-nursary').collection('medicinals');
        const userCollection = client.db('ankur-nursary').collection('users');
        const orderCollection = client.db('ankur-nursary').collection('orders');
        const reviewCollection = client.db('ankur-nursary').collection('reviews');

        // upsert userCollection
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //load all users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });


        //load all flowring plants
        app.get('/flowring', async (req, res) => {
            const query = {};
            const cursor = flowringCollection.find(query);
            const flowrings = await cursor.toArray();
            res.send(flowrings);
        });

        //load all medicinal plant
        app.get('/medicinal', async (req, res) => {
            const query = {};
            const cursor = medicinalCollection.find(query);
            const medicinals = await cursor.toArray();
            res.send(medicinals);
        });

        //load single medicinal plant by is
        app.get('/medicinal/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const medicinal = await medicinalCollection.findOne(query);
            res.send(medicinal);
        });

        //update single medicinal plant by id
        app.put('/medicinal/:id', async (req, res) => {
            const id = req.params.id;
            const medicinal = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: medicinal.updatedQuantity
                }
            };
            const result = await medicinalCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //order api--------------------------------

        //update order api
        app.put('/order', async (req, res) => {
            const id = req.params.id;
            const medicinal = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: medicinal
            };
            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //load all orders
        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        //load orders query by email
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        //order api--------------------------------

        //review api--------------------------------

        //upsert review collection
        app.put('/review/:email', async (req, res) => {
            const email = req.params.email;
            const review = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: review,
            };
            const result = await reviewCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //load all reviews
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        //review api--------------------------------  


        //admin api--------------------------------  
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: { role: 'admin' },
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        //admin api--------------------------------      
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome from ankur nursary');
})

app.listen(port, () => {
    console.log(`Ankur Nursary listening on port ${port}`);
})