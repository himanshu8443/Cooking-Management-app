import mongoose from "mongoose";
import { env } from "@/common/utils/envConfig";

const dbConnect = () => {
    mongoose.connect(env.MONGODB_URL, {
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error:any) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    } )
};

export default dbConnect;