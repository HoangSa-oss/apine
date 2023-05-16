import mongoose, { connect, model, Schema } from "mongoose";
import { Password } from "../service/password";
interface UserAttrs {
    email:string
    password:string
}
interface UserDoc extends mongoose.Document{
    email:string
    password:string
}
interface UserModel extends mongoose.Model<UserDoc>{
    build(user:UserAttrs):UserDoc
}
const userSchema = new Schema<UserAttrs>({
    email: { type: String, required: true },
    password: { type: String, required: true },
  }
  ,{
    toJSON:{
        transform(doc, ret, options) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
        },
    }
});
userSchema.statics.build = (user:UserAttrs)=>{
 return new User(user)
}
userSchema.pre('save',async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'))
        this.set('password',hashed)
    }
    done()
})
const User = model<UserDoc,UserModel>('User', userSchema);

export default User


