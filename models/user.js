let users = []; // In-memory storage for simplicity

const User = {
    create: (mobile_number, user_name) => {
        const user = {
            id: users.length + 1,
            mobile_number,
            user_name,
            created_at: new Date(),
            updated_at: new Date(),
        };
        users.push(user);
        return user;
    },
    findByMobile: (mobile_number) => {
        return users.find(u => u.mobile_number == mobile_number);
    }
};

module.exports = User;
