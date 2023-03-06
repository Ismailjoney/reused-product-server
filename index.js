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


 function jwtVerify(req, res, next){
    console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;
    //console.log(authHeader)

    if(!authHeader){
        return res.status(401).send('unAuthorazid access')
    }
    //split kore token k alada kora hoyece
    const token = authHeader.split(' ')[1]
    //console.log(token);

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message : 'forbiden access'})
        }
        req.decoded = decoded;
        next()
    })
    
    
 }


async function run() {
    try {
        const categoryCollection = client.db('resaleproducts').collection('categories')
        const categoryItemsCollection = client.db('resaleproducts').collection('categoriesItems')
        const  usersCollection = client.db('resaleproducts').collection('users')
        const  bookingCollection = client.db('resaleproducts').collection('booking')
        const usersPostCollections = client.db('resaleproducts').collection('userpost')



        app.get('/categories', async (req, res) => {
            const query = {}
            const resualt = await categoryCollection.find(query).toArray();
            res.send(resualt)

        })

        app.get('/categoriesItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { cid: id }
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
            console.log(users)
            const resualt = await usersCollection.insertOne(users)
            res.send(resualt)
        })
        //get user by email
        app.get('/users', async(req,res) => {
            const email = req.query.email;
            const query = {email : email}
            const  resualt =await usersCollection.findOne(query)
            res.send(resualt)
        })

        //when user booking product :
        app.post('/productbooking', async(req,res) => {
            const book = req.body;
            const booking = await bookingCollection.insertOne(book)
            console.log(booking)
            res.send(booking)
        })

        //my booking
        app.get('/mybookings', async( req, res) => {
            const email =req.query.email;
            const query ={email : email}
            const order = await bookingCollection.find(query).toArray();
            console.log(order);
            res.send(order)
        })
        //deletebooking
         app.delete('/bookings/:id',  async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = {_id : new  ObjectId(id)}
            const resualt = await  bookingCollection.deleteOne(filter);
            res.send(resualt)
        })

        //users posts--> 
        app.post('/sellerproduct', async(req,res) => {
            const product = req.body;
            const resualt = await usersPostCollections.insertOne(product);
            res.send(resualt)
        })

        app.get('/sellerproduct', async(req, res) => {
            const email = req.query.email;
            const query ={email : email}
            const resuat = await usersPostCollections.find(query).toArray();
            res.send(resuat)
        })

        app.delete('/sellerproduct/:id',  async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = {_id : new  ObjectId(id)}
            const resualt = await  usersPostCollections.deleteOne(filter);
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
