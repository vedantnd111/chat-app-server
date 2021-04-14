const users = [];

const addUsers = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const isExist = users.find((user) => {
        user.room === room && user.name === name;
    });
    if (isExist) {
        return { error: "username already exists!" };
    }
    else if(users.length==2){
        return {error:"room already contains 2 persons!"};
    }
    const user = { id, name, room };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => users.find(user => user.id === id);

const getUsersInRoom = (room) => users.filter(user => user.room === room);

module.exports = { addUsers, removeUser, getUser, getUsersInRoom };