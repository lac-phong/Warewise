import { create } from 'domain'
import express from 'express'
import cors from 'cors'

import { insertAccount, getAccount } from './database.js'

const app = express()

app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const user = await insertAccount( username, password )
    res.status(201).send(user)
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await getAccount( username, password )
    res.send(user)
})

app.listen(3001, () => {
    console.log("running server")
})