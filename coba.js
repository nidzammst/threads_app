// const userThreads = [
// 	{
// 		nama: 'nidzam',
// 		content: 'contoh content',
// 		children: [{
// 			nama: 'baim',
// 			content: 'jawab nidzam'
// 		},{
// 			nama: 'nidzam',
// 			content: 'jawab baim'
// 		},{
// 			nama: 'baim',
// 			content: 'jawab nidzam'
// 		}]
// 	},
// 	{
// 		nama: 'nidzam',
// 		content: 'contoh content',
// 		children: [{}]
// 	},
// 	{
// 		nama: 'nidzam',
// 		content: 'contoh content',
// 		children: [{
// 			nama: 'baim',
// 			content: 'jawab nidzam2'
// 		},{
// 			nama: 'nidzam',
// 			content: 'jawab baim2'
// 		},{
// 			nama: 'baim',
// 			content: 'jawab nidzam2'
// 		}]
// 	},
// ]

// Fungsi untuk menghasilkan tweet atau komentar secara acak
function generateRandomTweet() {
  	const tweets = Array.from({ length: 30 }, (_, index) => ({
		id: index + 1,
		tweet: `Ini adalah tweet nomor ${index + 1}.`
	}));

  const randomIndex = Math.floor(Math.random() * tweets.length);
  return tweets[randomIndex];
}

// Contoh data userThreads dengan children berisi array tweet atau komentar random
const userThreads = [
  {
    id: 1,
    tweet: generateRandomTweet(),
    children: Array.from({ length: 3 }, (_, index) => ({
      id: 100 + index,
      tweet: generateRandomTweet()
    }))
  },
  {
    id: 2,
    tweet: generateRandomTweet(),
    children: Array.from({ length: 2 }, (_, index) => ({
      id: 200 + index,
      tweet: generateRandomTweet()
    }))
  },
  {
    id: 3,
    tweet: generateRandomTweet(),
    children: Array.from({ length: 10 }, (_, index) => ({
      id: 300 + index,
      tweet: generateRandomTweet()
    }))
  }
];

const childThreadIds = userThreads.reduce((acc, userThread) => {
	return acc.concat(userThread.children);
}, [])

console.log(childThreadIds)