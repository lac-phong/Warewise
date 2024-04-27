import express from 'express'

import { 
    getBusiness,
    getBusinesses,
    insertBusiness,
    updateBusiness,
    deleteBusiness,

    getLocations,
    getLocation,
    getLocation,
    updateLocation,
    deleteLocation,


} from './database.js'


const app = express()

app.use(express.json())


// INTERNAL: get all businesses
app.get("/businesses", async (req, res) => {
    const businesses = await getBusinesses()
    res.send(businesses)
})

// EXTERNAL: get specific business
app.get("/business/:business_id", async (req, res) => {
    const id = req.params.business_id
    const business = await getBusiness(id)
    res.send(business)
})

// EXTERNAL: insert specific business
app.post("/business", async (req, res) => {
    const { business_id, account_id, business_name } = req.body
    const business = await insertBusiness(business_id, account_id, business_name)
    res.status(201).send(business)
})

// EXTERNAL: updating specific business
app.put("/business/:business_id", async (req, res) => {
    const { account_id, business_name } = req.body;
    const business_id = req.params.business_id;
    const updatedBusiness = await updateBusiness(business_id, account_id, business_name);
    res.send(updatedBusiness);
});

// EXTERNAL: delete specific business
app.delete("/business/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    await deleteBusiness(business_id);
    res.status(204).send();
});


// INTERNAL: get all businesses locations
app.get("/locations", async (req, res) => {
    const locations = await getLocations()
    res.send(locations)
})

// EXTERNAL: get specific business location
app.get("/location/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const location = await getLocation(business_id);
    res.send(location);
});

// EXTERNAL: insert specific business location
app.post("/location", async (req, res) => {
    const { business_id, address } = req.body;
    const location = await insertLocation(business_id, address);
    res.status(201).send(location);
});

// EXTERNAL: update specific business location
app.put("/location/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    const { address } = req.body;
    const updatedLocation = await updateLocation(business_id, address);
    res.send(updatedLocation);
});

// EXTERNAL: delete specific business location
app.delete("/location/:business_id", async (req, res) => {
    const business_id = req.params.business_id;
    await deleteLocation(business_id);
    res.status(204).send();
});


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})