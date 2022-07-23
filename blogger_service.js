
const { User } = require("./models/user");
const { UserBlog } = require("./models/user_blog");
const { UserFeed } = require("./models/user_feed");

// map to store all users
const users = {};

// map to store all blogs
const blogs = {};

// map to store all followers
const followers = {};

/**
 * create new user in the system
 * @param {User} user
 * @return {boolean} true for successful creation else false
*/
const createUser = (user) => {
    if (!user.userId || !user.name || !user.email) return false;

    // if user already exists, duplicate user cannot be added
    if (users[user.userId]) return false;

    // add user
    users[user.userId] = user;
    return true;
}


/**
 * create a {UserBlog} of a user
 * @param {UserBlog} userBlog
 * @return {boolean} true for successful creation else false
*/
const createBlog = (userBlog) => {
    // if userId or bolgId is not specified, then blog is invalid
    if (!userBlog.userId|| !userBlog.blogId) return false;
    
    // if user does not exist, then a blog for the null user can not be created
    if (!users[userBlog.userId]) return false;

    // if a blog with blogId = userBlog.blogId already exists, do not add duplicate blog
    if (blogs[userBlog.blogId]) return false;

    blogs[userBlog.blogId] = userBlog;
    return true;
}

/**
 * add user_1 as follower of user_2
 * @param {User} user1
 * @param {User} user2
 * @return {boolean} true for successful addition
*/
const followUser = (user1, user2) => {
    // any of user OR userId of user is null, return false
    if (!user1 || !user2 || !user1.userId || !user2.userId) return false;

    // if user1 does not exist, null follower cannot be added
    // if user2 does not exist, follower of null user cannot be added
    if (!users[user1.userId] || !users[user2.userId]) return false; 

    // if user2 has no followers initially, create an empty array to store its followers
    followers[user2.userId] = followers[user2.userId] || [];
    
    // add user1 as follower of user2
    followers[user2.userId].push(user1.userId);
    return true;
}

/**
 * get list of user_ids followed by {User}
 * @param {User} user
 * @return {String[]} return: list of user_ids
*/
const getFollowers = (user) => {
    // if user OR user.userId is null, return empty array;
    if (!user || !user.userId) return [];

    // follower list of null user is empty;
    if (!users[user.userId]) return [];

    // return follower list of user, or empty array in case of no followers
    return followers[user.userId] || [];
}

/**
 * get user_feed for {User} user_feed for a user contains list of blogs from users that user follows in sorted order of blogs created_at
 * @param {User} user
 * @return {UserFeed} user_feed
*/
const getUserFeed = (user) => {
    // initialize empty feed
    const feed = {
        count: 0,
        blog_list: []
    }

    // if incorrect user is specified, return empty feed
    if (!user || !user.userId) return feed;

    // array to store the list of users that user follows
    const following = [];

    // iterate over followers map
    // if user exists in followers list of blogger, push blogger in following of user
    for (const blogger in followers) {
        if (followers[blogger].includes(user.userId)) following.push(blogger);
    }


    // iterate over blogs 
    for (const blog in blogs) {
        // if blog is created by a user that is in following of current user,
        // add blog in feed of current user
        if (following.includes(blogs[blog].userId)) {
            feed.blog_list.push(blogs[blog]);
            feed.count = feed.count + 1;
        }
    }

    // sort feed in descending order by blog creation time
    feed.blog_list.sort((blog1, blog2) => blog1.createdAt > blog2.createdAt ? 1 : -1)

    return feed;
}


module.exports = {
    createUser : createUser,
    createBlog : createBlog,
    followUser : followUser,
    getFollowers: getFollowers,
    getUserFeed : getUserFeed,
};