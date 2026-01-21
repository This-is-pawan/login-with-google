const dotenv=require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const connection=async () => {
 try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`DB is connected successfully`);
  
 } catch (error) {
  console.log(error);
  console.log(`DB is disconnected `);
 }
}
module.exports=connection