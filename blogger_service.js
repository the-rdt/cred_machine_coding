
const { User } = require("./models/user");
const { UserBlog } = require("./models/user_blog");
const { UserFeed } = require("./models/user_feed");

/**
 * create new user in the system
 * @param {User} user
 * @return {boolean} true for successful creation else false
*/
const createUser = (user) => {
}


/**
 * create a {UserBlog} of a user
 * @param {UserBlog} userBlog
 * @return {boolean} true for successful creation else false
*/
const createBlog = (userBlog) => {
}

/**
 * add user_1 as follower of user_2
 * @param {User} user1
 * @param {User} user2
 * @return {boolean} true for successful addition
*/
const followUser = (user1, user2) => {
}

/**
 * get list of user_ids followed by {User}
 * @param {User} user
 * @return {String[]} return: list of user_ids
*/
const getFollowers = (user) => {
}

/**
 * get user_feed for {User} user_feed for a user contains list of blogs from users that user follows in sorted order of blogs created_at
 * @param {User} user
 * @return {UserFeed} user_feed
*/
const getUserFeed = (user) => {
}


module.exports = {
    createUser : createUser,
    createBlog : createBlog,
    followUser : followUser,
    getFollowers: getFollowers,
    getUserFeed : getUserFeed,
};