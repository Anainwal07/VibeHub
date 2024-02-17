import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
        // Sending back a 200 along with the data in JSON format
    }catch(err){
        res.status(404).json({message: err.message});
    }
};

export const getUserFriends = async(req , res) => {    
    try{    
        const { id } = req.params;
        const user  = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id , firstNmae, LastName, occupation, location, picturePath}) => {
                return {_id , firstNmae, LastName, occupation, location, picturePath}
            }
        );
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(404).json({message : err.message});
    }
};

// update
export const addRemoveFriend = async( req, res) => {
    try {
        const {id , friendId} = req.params;
        const  user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friend._id)){
           // remove friend from array  
           user.friends = user.friends.filter((id) => id !== friend._id ) ;
           friend.friends = friend.friends.filter((id) => id !== id);
        }else{
          //add to friend's potential friends and current user's friends
          user.friends.push(friend._id);
          friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id , firstNmae, LastName, occupation, location, picturePath}) => {
                return {_id , firstNmae, LastName, occupation, location, picturePath}
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({message : err.message});
    }
}