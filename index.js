const express  = require("express")
const mongoose = require("mongoose")
const zod = require("zod")
const jwt = require("jsonwebtoken")
const {signinSchema} = require("./validator/zodSchema")
const {signupSchema} = require("./validator/zodSchema")
const {todoSchema} = require("./validator/zodSchema")
const connectToDB = require("./db/connection");
const todos = require("./db/models/todos") 
// const users = require("./db/models/user.js") 
const user = require("./db/models/user.js")
const dotenv = require("dotenv");
const cors = require("cors")
const path = require("path")
const auth = require("./validator/auth");
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET ;
const PORT = process.env.PORT || 3000;

async  function getTheUsers(){
    const h = await user.find()
    console.log(h) ; 
}
async function getTheTodos(){
    const tasks = await todos.find();
    console.log(tasks);
}


const startApp = async () => {
  await connectToDB(); 
};
startApp();



app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , "Frontend")));
app.use(cors())
//routes
app.get("/" , (req , res)=>{
    res.sendFile(path.join(__dirname , "/Frontend/index.html"));
})
//signup route
app.post("/signup" , async (req ,res)=>{
    try{
        const data = signupSchema.safeParse(req.body );
        console.log(data)
        if(!data.success){
            res.json({
                isSignUp : false,
                message : data.error.errors[0].message,
            })
        }
        else{
            const {name , email , password} = req.body ;
            await  user.create({
                name : name,
                email : email,
                password : password
            })
            res.json({
                isSignUp : true,
            })
        }
    }catch(err){
        console.log("err during sign up" , err)
    }
})
//Signin route
app.post("/signin" ,async  (req , res)=>{
    try{
        const response = signinSchema.safeParse(req.body);
        if(!response.success){
            res.json({
                message :  response.error.errors[0].message,
            })
        }else {
        const {email , password} = req.body;
        const isUser = await user.findOne({email : email , password : password});
        if(isUser){
            const token = jwt.sign({email} , JWT_SECRET) ;
            isUser.token = token;
            await isUser.save(); 
             res.json({
                isUser : true,
                token : token,
             })
        }else{
            res.json({
                isUser : false , 
            })
        }
    }
    }catch(err){
        console.log("error " , err);
    }
})


//Add a todos 
app.post("/to-dos", auth , async (req , res)=>{
    try{
        const todosDetails = todoSchema.safeParse(req.body);
        if(todosDetails.success){
            const {userId , title, priority , done} = req.body;
            console.log(req.body)
            await todos.create({
                userId : userId,
                title : title ,
                priority : priority ,
                done : done ,
            });
            getTheTodos();
            res.json({
                message : "task is added !!" ,
            })
        }else{
            console.log(todosDetails.error.errors[0].message);
            res.json({
                message : "user not found"
            })
        }
    }catch(err){
        console.log(err);
        res.json({
            err,
        });
    }
    
})

app.get("/api-user-data" , auth , async (req ,res)=>{
    try{
        const token = req.headers.token;
        const userDetails = await user.findOne({token});
        const id = userDetails.id ;
        res.send({userDetails});
    }catch(err){
        console.log("error to get the data")
    }
})

app.get("/to-do-list" , auth , async (req ,res)=>{
    const token =req.headers.token;
    console.log(token)
    const userDetails = await user.findOne({token : token});
    console.log(userDetails)
    const userId = userDetails._id;
    const allTodos = await todos.find({userId});
    res.json({
        allTodos ,
    })
})

app.delete("/delete-todos" , auth , async (req , res)=>{
    const {id , token} = req.headers;
    const todo = await todos.deleteOne({_id :id});
    res.json({todo})
})

app.put("/to-dos" , auth , async (req, res)=>{
    const {id } = req.headers;
    const {done} = req.body;
    const todo = await todos.updateOne({_id : id} , {completed : done})
    res.json({
        todo
    })
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


