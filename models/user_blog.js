class UserBlog {

    /**
    * @param {string} userId
    * @param {string} blogId
    * @param {string} title
    * @param {string} text
    * @param {number} createdAt
    */
    constructor(userId, blogId, title, text, createdAt) {
        this.userId = userId;
        this.blogId = blogId;
        this.title = title;
        this.text = text;
        this.createdAt = createdAt
    }
}

module.exports.UserBlog = UserBlog;