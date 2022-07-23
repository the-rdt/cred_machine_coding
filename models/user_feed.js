const { UserBlog } = require("./user_blog");

class UserFeed {

    /**
    * @param {number} count
    * @param {UserBlog[]} blog_list
    */
    constructor(count, blog_list) {
        this.count = count;
        this.blog_list = blog_list;
    }
}

module.exports.UserFeed = UserFeed;