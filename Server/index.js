const cors = require("cors");
const express = require("express");
const objectId = require('mongodb').ObjectId
const { MongoClient, ServerApiVersion } = require('mongodb');
const shortId = require('shortid')
require('dotenv').config()
const port = process.env.PORT || 5001
const bodyParser = require('body-parser');
const app = express();





// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wanl6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnat7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


async function run() {

    try {
        await client.connect();
        const database = client.db("linkShortener");
        const linkShortenerCollection = database.collection('linkShortener-links')
        const RealTimeDataCollection = database.collection('linkShortener-realTime-data')


        // ============ ======================== linkShortener ====================== ===================== //

        // LINK SHRINK

        app.get('/shortUrls', async (req, res) => {
            const shortUrls = linkShortenerCollection.find()
            const result = await shortUrls.toArray()
            res.send(result)
            // console.log(result);
        })


        app.post('/shortUrls', async (req, res) => {
            const uniqueUrl = shortId({ url: req.body.url })
            console.log(req.body, 'asd');
            const details = {
                short: uniqueUrl,
                full: req.body.url,
                clicks: 0,
                date: req.body.date,
            }
            const result = await linkShortenerCollection.insertOne(details)
            res.json({ result, uniqueUrl })
        })


        // GET SHORT URL
        app.get('/findUrl/:shortUrl', async (req, res) => {
            const shortenUrl = await linkShortenerCollection.findOne({ short: req.params.shortUrl })
            let isUrlTrue = false;
            if (shortenUrl?.short === req.params.shortUrl) {
                isUrlTrue = true
            }
            res.json({ isUrlTrue: isUrlTrue })
        })

        // GET DAILY UPDATE
        app.get('/ref/updates', async (req, res) => {
            const shortUrls = RealTimeDataCollection.find()
            const result = await shortUrls.toArray()
            res.send(result)
        })

        // DELETE SHORT URL
        app.delete('/delete/shortUrl/:shortUrl', async (req, res) => {
            const short = req.params.shortUrl
            const query = { short: short }
            const result = await linkShortenerCollection.deleteOne(query)
            // const result2 = await bicycleRealTimeDataCollection.deleteOne(query)
            res.json(result)
        })



        app.get('/:shortUrl', async (req, res) => {
            const filter = {
                short: req.params.shortUrl
            }

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            // GETTING THE USER EMAIL TO UPDATE THE EXACT USER VALUES
            const user = await linkShortenerCollection.findOne(filter)
            let updateData
            if (user) {
                updateData = {
                    $set: {
                        date: date,
                        short: req.params.shortUrl
                    },
                    $inc: {
                        clicks: 1
                    }
                }
                // IT WILL UPDATE THE VALUES WHO CREATED THE SHORT URL
                const realTimeUpdate = await RealTimeDataCollection.findOneAndUpdate({ short: req.params.shortUrl }, updateData, {
                    new: true,
                    upsert: true
                })

                const updateDoc = {
                    $inc: {
                        clicks: 1
                    }
                }
                // IT WILL UPDATE THE SPECIFIC URL OBJECT
                const urlDoc = await linkShortenerCollection.findOneAndUpdate(filter, updateDoc, {
                    new: false,
                    upsert: true
                })

                res.redirect(`${urlDoc.value.full}?ref=${req.params.shortUrl}`)
            }



        })


    } finally {


    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));