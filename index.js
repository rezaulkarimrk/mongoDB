const express = require('express');
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rk000111:rk000111@cluster0.crrhbie.mongodb.net/?retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");

    app.get('/products', (req, res) => {
        collection.find({})         //.limit(2)
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            });
    })


    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log('data added successfully');
                res.redirect('/');
            })
    });

    app.patch(`/update/:id`, (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: parseInt(req.body.price), quantity: parseInt(req.body.quantity) }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            });
    });

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            });
    });

    // const product = { name: 'T-Shirt', price: 33, quantity: 333 };
    // app.post('/addProduct', (req, res) => {
    //     collection.insertOne(product)
    //         .then(res => {
    //             console.log('Once product added');
    //         })
    // });



    // console.log('Database connection');
    // client.close();
});


app.listen(3000);