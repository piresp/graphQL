const graphql = require('graphql');
var _ = require('lodash');

var usersData = [
  { id: '0', name: 'piresp', age: 23, profession: 'developer' },
  { id: '1', name: 'joao', age: 56, profession: 'artist' },
  { id: '2', name: 'sudo', age: 78, profession: 'cleaner' },
  { id: '3', name: 'little boss', age: 2, profession: 'chef' },
  { id: '4', name: 'vanessa', age: 45, profession: 'student' },
  { id: '5', name: 'rafinha', age: 29, profession: 'unemployed' },
]

var hobbiesData = [
  { id: '0', title: 'Programming', description: 'So nos computer', userId: '0' },
  { id: '1', title: 'Rowing', description: 'Sweat and fell better before eating donouts', userId: '1' },
  { id: '2', title: 'Swimming', description: 'learn how to become water', userId: '2' },
  { id: '3', title: 'Fencing', description: 'hobby for fancy people', userId: '3' },
  { id: '4', title: 'Hiking', description: 'explore the world', userId: '0' },
]

var postData = [
  { id: '0', comment: 'building a mind', userId: '0' },
  { id: '1', comment: 'wow', userId: '1' },
  { id: '2', comment: 'i really love this', userId: '0' },
]

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return _.filter(postData, { userId: parent.id })
      }
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return _.filter(hobbiesData, { userId: parent.id })
      }
    }
  })
})

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId })
      }
    }
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: '',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(usersData, { id: args.id });
      }
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return usersData;
      }
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(hobbiesData, { id: args.id });
      }
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbiesData;
      }
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(postData, { id: args.id });
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return postData;
      }
    },
  }
})

// Mutations 
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = {
          name: args.name,
          age: args.age,
          profession: args.profession
        }
        return user;
      }
    },

    createPost: {
      type: PostType,
      args: {
        //id: { type: GraphQLID },
        comment: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let post = {
          comment: args.comment,
          userId: args.userId
        }
        return post;
      }
    },

    createHobby: {
      type: HobbyType,
      args: {
        //id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let hobby = {
          title: args.title,
          description: args.description,
          userId: args.userId
        }
        return hobby;
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
