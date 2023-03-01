const express = require(`express`)
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()
//middleware
app.use(cors())
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://resaleproducts:BDiMKzoLVzeXzz5N@cluster0.i8hxp3j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        const categoryCollection = client.db('resaleproducts').collection('categories')
        const categoryItemsCollection = client.db('resaleproducts').collection('categoriesItems')



        app.get('/categories', async (req, res) => {
            const query = {}
            const resualt = await categoryCollection.find(query).toArray();
            res.send(resualt)

        })

        app.get('/categoriesItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { cid:   id }
            console.log(query)
            const categorieitems = await categoryItemsCollection.find(query).toArray();
            res.send(categorieitems)
        })



    }
    finally {

    }

}
run().catch(err => console.log(err))












app.get('/', (req, res) => {
    res.send(` resale product service running`)
})

app.listen(port, () => {
    console.log(`the port is running ${port}`);
})
