"use strict"

var chai = require('chai');
var chaiHttp = require('chai-http');
const decache = require('decache');
var expect = chai.expect;
var uuid = require('uuid').v4;
chai.use(chaiHttp);

const { User } = require("../models/user");
const { UserFeed } = require("../models/user_feed");
const { UserBlog } = require("../models/user_blog");

var bloggerService = require("../blogger_service");


describe('blogger tests', function() {

    beforeEach(function() {
        decache("../blogger_service");
        bloggerService = require("../blogger_service");
    });
	
    it('Add User successfully', (done) => {
        expect(bloggerService.createUser(getRandomUser()), "Sucessfully add user").to.be.equal(true);
        done();
	});


    it('Add User Failure', (done) => {
        const userId = uuid();
        expect(bloggerService.createUser(new User(null, null, null)), "Should not add invalid user").to.be.equal(false);
        expect(bloggerService.createUser(new User(userId ,"Brand A" , "temp_mail@gmail.com")), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.createUser(new User(getMockUser(userId))), "Should not add duplicate user").to.be.equal(false);
        done();
	});

    it('Add invalid User Failure', (done) => {
        const userId = uuid();
        expect(bloggerService.createUser(new User(null, null, null)), "Should not add invalid user").to.be.equal(false);
        expect(bloggerService.createUser(new User("test", null, null)), "Should not add invalid user").to.be.equal(false);
        expect(bloggerService.createUser(new User(null, "test", null)), "Should not add invalid user").to.be.equal(false);
        expect(bloggerService.createUser(new User(null, null, "test")), "Should not add invalid user").to.be.equal(false);
        expect(bloggerService.createUser(getRandomUser()), "Sucessfully add user").to.be.equal(true);
        done();
	});

   
    it('Add Blog Success', (done) => {
        var userBlog = getRandomUserBlog()        
        expect(bloggerService.createBlog(userBlog), "invalid userId with blog").to.be.equal(false);
        var user = getRandomUser();
        expect(bloggerService.createUser(user), "Sucessfully create user").to.be.equal(true);
        userBlog.userId = user.userId;
        expect(bloggerService.createBlog(userBlog), "Sucesfully Create Blog").to.be.equal(true);
        done();
	});


    it('Duplicate blog should not be added', (done) => {
        var userBlog = getRandomUserBlog()        
        expect(bloggerService.createBlog(userBlog), "invalid userId with blog").to.be.equal(false);
        
        var user = getRandomUser()
        expect(bloggerService.createUser(user), "Sucessfully add user").to.be.equal(true);
        userBlog.userId = user.userId;
        expect(bloggerService.createBlog(userBlog), "Sucesfully Create Blog").to.be.equal(true);
        expect(bloggerService.createBlog(userBlog), "don't create duplicate Blog").to.be.equal(false);

        var user_1 = getRandomUser();
        expect(bloggerService.createUser(user_1), "Sucessfully add user").to.be.equal(true);
        userBlog.userId = user_1.userId
        expect(bloggerService.createBlog(userBlog), "don't create duplicate Blog").to.be.equal(false);
        done();
	});

 
    it('add invalid blog', (done) => {
        expect(bloggerService.createBlog(new UserBlog(null, null, null, null, null)), "don't create invalid Blog").to.be.equal(false);
        expect(bloggerService.createBlog(new UserBlog(uuid(), null, null, null, null)), "don't create invalid Blog").to.be.equal(false);
        expect(bloggerService.createBlog(new UserBlog(null, null, null, null, uuid())), "don't create invalid Blog").to.be.equal(false);
        var user = getRandomUser()
        bloggerService.createUser(user)
        var userBlog = getRandomUserBlog();
        userBlog.userId = user.userId
        expect(bloggerService.createBlog(new UserBlog(null, null, null, null, user.userId)), "don't create invalid Blog").to.be.equal(false);
        expect(bloggerService.createBlog(userBlog), "create Blog").to.be.equal(true);
        done();
	});
    
    it('follow user sucess', (done) => {
        var user1 = getRandomUser()
        var user2 = getRandomUser()
        expect(bloggerService.createUser(user1), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.createUser(user2), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.followUser(user1, user2), "Sucessfully follow").to.be.equal(true);
        var followers = bloggerService.getFollowers(user2)
        expect(1).to.be.equal(followers.length);
        expect(user1.userId).to.be.equal(followers[0]);
        done();
	});

    it('follow user failure', (done) => {
        var user1 = getRandomUser()
        var user2 = getRandomUser()
        expect(bloggerService.followUser(user1, user2), "follow user failure").to.be.equal(false);
        expect(bloggerService.createUser(user1), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.followUser(user1, user2), "follow user failure").to.be.equal(false);
        var followers = bloggerService.getFollowers(user1)
        expect(followers.length).to.be.equal(0);
        done();
	});

        
    it('multiple follow user', (done) => {
        var user1 = getRandomUser();
        var user2 = getRandomUser();
        var user3 = getRandomUser();
        var user4 = getRandomUser();
        expect(bloggerService.createUser(user1), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.createUser(user2), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.createUser(user3), "Sucessfully add user").to.be.equal(true);
        expect(bloggerService.createUser(user4), "Sucessfully add user").to.be.equal(true);

        expect(bloggerService.followUser(user2, user1), "follow user").to.be.equal(true);
        expect(bloggerService.followUser(user3, user1), "follow user").to.be.equal(true);
        expect(bloggerService.followUser(user4, user1), "follow user").to.be.equal(true);
        var followers = bloggerService.getFollowers(user1)
        expect(followers.length).to.be.equal(3);
        expect(followers.includes(user2.userId)).to.be.equal(true);
        expect(followers.includes(user3.userId)).to.be.equal(true);
        expect(followers.includes(user4.userId)).to.be.equal(true);
        done();
	});

    it('user feed invalid user', (done) => {
        var user_feed = bloggerService.getUserFeed(getRandomUser());
        expect(user_feed, "user feed not null").to.be.not.equal(null);
        expect(user_feed.count, "for a non created user count will be 0").to.be.equal(0);
        expect(user_feed.blog_list, "user feed blog_list should notbe null").to.be.not.equal(null);
        expect(user_feed.blog_list.length, "for invalid user length will be").to.be.equal(0);
        done();
	});

    it('user feed zero following user', (done) => {
        var user = getRandomUser();
        expect(bloggerService.createUser(user), "Sucessfully create user").to.be.equal(true);
        var user_feed = bloggerService.getUserFeed(user);
        expect(user_feed, "user feed not null").to.be.not.equal(null);
        expect(user_feed.count, "for a non created user count will be 0").to.be.equal(0);
        expect(user_feed.blog_list, "user feed blog_list should notbe null").to.be.not.equal(null);
        expect(user_feed.blog_list.length, "for invalid user length will be").to.be.equal(0);
        done();
    });

    it('User Feed Non Zero Following Zero Blogs User', (done) => {
        var user1 = getRandomUser();
        var user2 = getRandomUser();

        expect(bloggerService.createUser(user1), "Sucessfully create user1").to.be.equal(true);
        expect(bloggerService.createUser(user2), "Sucessfully create user2").to.be.equal(true);

        expect(bloggerService.followUser(user2, user1), "follow user").to.be.equal(true);
        var userBlog = getRandomUserBlog();
        userBlog.userId = user1.userId;
        expect(bloggerService.createBlog(userBlog), "Sucessfully create blog").to.be.equal(true);

        var user_feed = bloggerService.getUserFeed(user1);
        expect(user_feed, "user feed not null").to.be.not.equal(null);
        expect(user_feed.count, "for a non created user count will be 0").to.be.equal(0);
        expect(user_feed.blog_list, "user feed blog_list should notbe null").to.be.not.equal(null);
        expect(user_feed.blog_list.length, "for invalid user length will be").to.be.equal(0);
        done();
    });

    it('User Feed Non Zero Following Non Zero Blogs User', (done) => {
        var user1 = getRandomUser();
        var user2 = getRandomUser();
        var user3 = getRandomUser();


        expect(bloggerService.createUser(user1), "Sucessfully create user1").to.be.equal(true);
        expect(bloggerService.createUser(user2), "Sucessfully create user2").to.be.equal(true);
        expect(bloggerService.createUser(user3), "Sucessfully create user3").to.be.equal(true);

        expect(bloggerService.followUser(user1, user2), "follow user").to.be.equal(true);
        expect(bloggerService.followUser(user1, user3), "follow user").to.be.equal(true);
        var userBlog1 = getRandomUserBlog();
        userBlog1.createdAt = 23;
        var userBlog2 = getRandomUserBlog();
        userBlog2.createdAt = 24;
        var userBlog3 = getRandomUserBlog();
        userBlog3.createdAt = 33;
        var userBlog4 = getRandomUserBlog();
        userBlog4.createdAt = 43;
        var userBlog5 = getRandomUserBlog();
        userBlog5.createdAt = 53;
        var userBlog6 = getRandomUserBlog();
        userBlog6.createdAt = 63;
        var userBlog7 = getRandomUserBlog();
        userBlog7.createdAt = 73;
        var userBlog8 = getRandomUserBlog();
        userBlog8.createdAt = 83;
        var userBlog9 = getRandomUserBlog();
        userBlog9.createdAt = 93;
        var userBlogList1 = [];
        Array.from([userBlog5, userBlog4, userBlog6]).forEach(blog => { 
            blog.userId = user1.userId;
            bloggerService.createBlog(blog);
            userBlogList1.push(blog);
        });
        var userBlogList2 = [];
        var userBlogList3 = [];
        Array.from([userBlog1, userBlog2, userBlog3]).forEach(blog =>{
            blog.userId = user2.userId;
            bloggerService.createBlog(blog);
            userBlogList2.push(blog);
        });

        Array.from([userBlog9, userBlog7, userBlog8]).forEach(blog =>{
            blog.userId = user3.userId;
            bloggerService.createBlog(blog);
            userBlogList3.push(blog);
        } );

        var userFeed = bloggerService.getUserFeed(user1);
        expect(userFeed, "user feed not null").to.be.not.equal(null);
        expect(userFeed.count, "user feed count should be 6").to.be.equal(6);
        expect(userFeed.blog_list, "user feed blog_list should not be null").to.be.not.equal(null);
        expect(userFeed.blog_list.length, "for invalid user length should be 6").to.be.equal(6);
        var expectedBlogList = Array.from([userBlog1, userBlog2, userBlog3, userBlog7, userBlog8, userBlog9]);
        for(var i = 0; i < expectedBlogList.length;i++){
            expect(expectedBlogList[i].blogId, "blog ids should be equal").to.be.equal(userFeed.blog_list[i].blogId)
      }
        done();
    });    
});

var getMockUser = (userId) => {
    return new User(userId ,"Brand A" , "temp_mail@gmail.com");
}

var getRandomUser = () => {
    var name = getRandomName()
    return new User(uuid(), name, name + "@gmail.com")
}

var getRandomName = () => {
    var nameList = ["Ramesh", "Suresh", "Kamlesh", "Prathmesh", "Rajesh", "Venkatesh"];
    return nameList[Math.floor(Math.random()*nameList.length)];
}

var getRandomUserBlog = () => {
    var random_blog_titles = ["Gravitation", "Motion", "Resonance", "Rain", "News", "Games"];
    var random_blog_text = ["Some useful info", "Some more useful info", "Another useful info",
                             "useful facts about useful info", "Not useful info", "quite useful info"];
    return new UserBlog(uuid(), uuid(), random_blog_titles[Math.floor(Math.random()*random_blog_titles.length)],
    random_blog_text[Math.floor(Math.random()*random_blog_text.length)], Math.floor(Math.random() * 1000));
}