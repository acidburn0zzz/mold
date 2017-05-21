import {sequelize} from './index'
import cache from 'sequelize-redis-cache'
import redis from 'redis'

let redisClient = redis.createClient(6379, 'localhost')
let cachedPage = cache(sequelize, redisClient).model('Page').ttl(1)
let cachedSite = cache(sequelize, redisClient).model('Site').ttl(1)
let cachedUser = cache(sequelize, redisClient).model('User').ttl(1)
let cachedPost = cache(sequelize, redisClient).model('Post').ttl(1)
let cachedImage = cache(sequelize, redisClient).model('Image').ttl(1)

export {cachedPage, cachedSite, cachedUser, cachedPost, cachedImage}
