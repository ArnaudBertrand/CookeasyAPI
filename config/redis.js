var redis = require('redis');
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

client.on('error', function (err) {
  console.log('Error ' + err);
});

client.on('connect', function () {
  console.log('Redis is ready');
});

exports.redis = redis;
exports.redisClient = client;