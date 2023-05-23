import connectMongo from '../../../../connection/conn';
import UsersL from '../../../../model/login'
import { hash } from 'bcryptjs';
import mongoose from 'mongoose';
export default async function handler(req, res){
    mongoose.set("strictQuery", false);
    connectMongo().catch(error => res.json({ error: "Connection Failed...!"}))

    // only post method is accepted
    if(req.method === 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const {email, password } = req.body;
        console.log(req.body)

      

        // hash password
        UsersL.create({email,password : await hash(password, 12)}, function(err, data){
            if(err) return res.status(404).json({ err });
            return res.status(201).json({ status : true, user: data})
            
        })

    } else{
       return  res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }
    

}