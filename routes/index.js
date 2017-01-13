var express = require('express');
var router = express.Router();

const TwitterPackage = require('twitter');
const moment = require('moment');
moment().format();

var secret = {
    consumer_key: 'CZWYUmvFG6m52jsSUHJpYsHn3',
    consumer_secret: 'wUAa8klW71tXyXKvcS3oe14IQde0vmsJ0pBAV6UKaOYdNtf5Bb',
    access_token_key: '14998667-teRwatdZIZYufUIBsKMFXC4onn40kCKMsITB88OYZ',
    access_token_secret: 'ReaE1oSKBhYHaK9rnCpChAkuOKzydNDZCA4JYD94BJL18'
}

var Twitter = new TwitterPackage(secret);
// 5 hours time difference

const TrumpCalculator = (tweet) => {
  const tweetTime = moment(tweet.created_at)
  const diff = tweetTime.diff(moment(), 'hours');
  const localTweetTime = tweetTime.utcOffset(-5);
  const message = 'Donald Trump tweeted ' + tweetTime.fromNow();

  let awake = "Yes"

  // if it is night time for donald, then he's probably asleep
  if ((localTweetTime.hours() >= 10 || localTweetTime.hours() < 6) && diff >=2) {
    awake = "No"
  }


  return {
    awake: awake,
    message: message
  }

}

/* GET home page. */
router.get('/', function(req, res, next) {

    Twitter.get('search/tweets.json?q=from%3ArealDonaldTrump&result_type=recent', function(error, tweets, response) {
        if (error) {
            console.log(error);
        }

        const tweet = tweets.statuses[0];
        const isDonaldTrumpAwake = TrumpCalculator(tweet);

        res.render('index', {
            title: 'Is Donald Trump Awake Right Now?',
            tweet: tweet,
            message: isDonaldTrumpAwake.message,
            awake: isDonaldTrumpAwake.awake,
            friendlyDate: moment(tweet.created_at).calendar(),
            localTime: moment().utcOffset(-5).format('h:mm a')
        });
    });
});

module.exports = router;
