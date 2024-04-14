import express from 'express'

import { getBusinesses, insertBusiness } from './database.js'


const app = express()

app.use(express.json())


app.get("/businesses", async (req, res) => {
    const businesses = await getBusinesses()
    res.send(businesses)
})

app.post("/businesses", async (req, res) => {
    const { business_id, business_name, days_of_op, ambient_type, address, business_category_id } = req.body
    const business = await insertBusiness(business_id, business_name, days_of_op, ambient_type, address, business_category_id)
    res.status(201).send(business)
})


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})