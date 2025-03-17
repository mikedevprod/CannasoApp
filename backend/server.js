import express from 'express'
import Router from './Router/Router.js'

const app = express()

app.use(express.json())
app.use("/api", Router)

app.listen(3000, ()=>{
    console.log("SERVIDO INICIADO =D");
})