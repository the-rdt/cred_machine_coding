class User {

    /**
    * @param {string} userId
    * @param {string} name
    * @param {string} email
    */
    constructor(userId, name, email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
    }

}

module.exports.User = User;