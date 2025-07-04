const zod = require("zod");

const signupSchema = zod.object({
    name : zod.string().min(3 , "must be at least 3 charecter"),
    email : zod.string().email("Invalid email address"),
    password : zod.string().min(8 , "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/ , "Password must contain uppercase, lowercase, and special character")
})

const signinSchema = zod.object({
    email : zod.string().email("incorrect email "),
    password : zod.string().min(8 , "Too small password")
})

const todoSchema = zod.object({
    title : zod.string().min(1 , "Title is required"),
    description : zod.string().optional(),
    priority : zod.enum(["Low", "Medium" , "High"]).optional(),
    dueDate : zod.string().optional()
})

module.exports = {
    signinSchema ,
    signupSchema,
    todoSchema,
};