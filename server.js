
const express = require("express")
const db= require("./database")

const server = express()

server.use(express.json())

server.get("/users", (req, res)=>{
    const users = db.getUsers()
   
    if(users) {
        res.json(users)
    } else {
        res.status(500)({
            errorMessage:  
            "The users information could not be retrieved." 
        })
    }
})

server.get("/users/:id", (req, res)=> {
    const id = req.params.id
    const user = db.getUserById(id)

    if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    }
    if(user){
        res.status(201).json(user)
    } else {
        res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        })
    }
})


server.post("/users", (req, res)=> {
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio
    })

    if(!req.body.name || !req.body.bio){
        return res.status(404).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }
    if(newUser) {
         res.status(201).json(newUser)
    } 
    else {
          res.status(500).json({
              errorMessage: "There was an error while saving the user to the database"
          })  
    }
})

server.delete("/users/:id", (req, res)=>{
    const id = req.params.id
    const user = db.getUserById(id)
    //const users = db.getUsers()

    if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
        //console.log (users);
    }

    if (user) {
        db.deleteUser(id)
    } 
    else {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        })
    }
})

server.put("/user/:id", (req, res)=> {
    const id = req.params.id
    const user = db.getUserById(id)

    if (user) {
        const updateUser = db.updateUser(id, {
            name: req.body.name,
            bio: req.body.bio
        })

        res.status(200).json(updateUser)
    } 
    if (!req.body.name || !req.body.bio){
        return res.status(404).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }
    if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    }
    else {
        res.status(500).json({
            errorMessage: "The user information could not be modified"
        })
    }
})



server.listen(8080, () => {
    console.log("server started")
})