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

        app.get('/flowring', async (req, res) => {
            const query = {};
            const cursor = flowringCollection.find(query);
            const flowrings = await cursor.toArray();
            res.send(flowrings);
        });

        app.get('/medicinal', async (req, res) => {
            const query = {};
            const cursor = medicinalCollection.find(query);
            const medicinals = await cursor.toArray();
            res.send(medicinals);
        });

        app.get('/medicinal/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const medicinal = await medicinalCollection.findOne(query);
            res.send(medicinal);
        });
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