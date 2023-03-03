const express = require(`express`)
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()
//middleware
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i8hxp3j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        const categoryCollection = client.db('resaleproducts').collection('categories')
        const categoryItemsCollection = client.db('resaleproducts').collection('categoriesItems')
        const  usersCollection = client.db('resaleproducts').collection('users')



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

        //get jwt by email
        app.get('/jwt', async(req,res) => {
            const email = req.query.email;
            console.log(email)
            const query = {email : email}
            const user = await usersCollection.findOne(query);

            if(user){
                const token = jwt.sign({email}, process.env.ACESS_TOKEN, { expiresIn :'7d'})
                return res.send ({accessToken : token})
            }
            res.status(403).send({ accessToken : ''})
        })

        //users information save in data base
        app.post('/users', async( req, res ) =>{
            const users = req.body;
            const resualt = await usersCollection.insertOne(users)
            res.send(resualt)
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
