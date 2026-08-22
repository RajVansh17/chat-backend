import User from "../model/User.js";

const testUserCreate = async () => {
    try{
        const user = await User.create(
            {
            username: "raj",
            email: "raj@example.com",
            passwordHash: "test_hash",
            }
        )
        console.log(user);

    }
    catch(err){
        console.log(err);
    }
}

export default testUserCreate;