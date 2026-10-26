const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// కొత్త పోస్ట్ చేయడం
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({ userId: req.user.id, text: req.body.text, imageUrl: req.body.imageUrl });
        res.status(201).json(await newPost.save());
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// అందరి పోస్ట్‌లు చూడటం
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name profilePic').sort({ createdAt: -1 }); 
        res.json(posts);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// లైక్ / అన్‌లైక్
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }
        res.json(await post.save());
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// కామెంట్ చేయడం
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const newComment = new Comment({ postId: req.params.id, userId: req.user.id, text: req.body.text });
        res.status(201).json(await newComment.save());
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// కామెంట్స్ చూడటం
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id }).populate('userId', 'name');
        res.json(comments);
    } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

// 50 డెమో పోస్టులు
router.get('/seed', async (req, res) => {
    try {
        await Post.deleteMany({});
        let user = await User.findOne(); 
        if (!user) return res.send("దయచేసి మొదట యాప్ లో రిజిస్టర్ అవ్వండి.");

        const dummyPosts = [
            { userId: user._id, text: "King of the jungle 🦁", imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500" },
            { userId: user._id, text: "Ferocious Tiger 🐯", imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=500" },
            { userId: user._id, text: "Gentle Giant Elephant 🐘", imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500" },
            { userId: user._id, text: "Cute Panda 🐼", imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500" },
            { userId: user._id, text: "Playful Monkey 🐒", imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=500" },
            { userId: user._id, text: "Man's best friend 🐶", imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500" },
            { userId: user._id, text: "Cute Cat 🐱", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500" },
            { userId: user._id, text: "Grizzly Bear 🐻", imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500" },
            { userId: user._id, text: "Deer in the wild 🦌", imageUrl: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=500" },
            { userId: user._id, text: "Fast Cheetah 🐆", imageUrl: "https://images.unsplash.com/photo-1557401620-67270b61ea82?w=500" },
            { userId: user._id, text: "Colorful Parrot 🦜", imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500" },
            { userId: user._id, text: "Eagle flying high 🦅", imageUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=500" },
            { userId: user._id, text: "Beautiful Peacock 🦚", imageUrl: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=500" },
            { userId: user._id, text: "Wise Owl 🦉", imageUrl: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?w=500" },
            { userId: user._id, text: "Graceful Swan 🦢", imageUrl: "https://images.unsplash.com/photo-1575470888356-bdc3d3c88ecb?w=500" },
            { userId: user._id, text: "Pink Flamingo 🦩", imageUrl: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=500" },
            { userId: user._id, text: "Cute Penguin 🐧", imageUrl: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=500" },
            { userId: user._id, text: "Toucan 🦜", imageUrl: "https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=500" },
            { userId: user._id, text: "Kingfisher 🐦", imageUrl: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=500" },
            { userId: user._id, text: "White Dove 🕊️", imageUrl: "https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=500" },
            { userId: user._id, text: "Cricket match 🏏", imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500" },
            { userId: user._id, text: "Football action ⚽", imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500" },
            { userId: user._id, text: "Basketball game 🏀", imageUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500" },
            { userId: user._id, text: "Tennis court 🎾", imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500" },
            { userId: user._id, text: "Badminton smash 🏸", imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500" },
            { userId: user._id, text: "Marathon running 🏃‍♂️", imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500" },
            { userId: user._id, text: "Swimming pool 🏊‍♂️", imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500" },
            { userId: user._id, text: "Cycling race 🚴", imageUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=500" },
            { userId: user._id, text: "Boxing ring 🥊", imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500" },
            { userId: user._id, text: "Golf swing ⛳", imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500" },
            { userId: user._id, text: "Beautiful Switzerland 🇨🇭", imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500" },
            { userId: user._id, text: "Paris, France 🇫🇷", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500" },
            { userId: user._id, text: "Tokyo, Japan 🇯🇵", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500" },
            { userId: user._id, text: "New York, USA 🇺🇸", imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500" },
            { userId: user._id, text: "Taj Mahal, India 🇮🇳", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500" },
            { userId: user._id, text: "Rome, Italy 🇮🇹", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500" },
            { userId: user._id, text: "Dubai, UAE 🇦🇪", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500" },
            { userId: user._id, text: "Sydney, Australia 🇦🇺", imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500" },
            { userId: user._id, text: "London, UK 🇬🇧", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500" },
            { userId: user._id, text: "Great Wall, China 🇨🇳", imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500" },
            { userId: user._id, text: "Beautiful smile 😊", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500" },
            { userId: user._id, text: "Nature portrait 🌿", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500" },
            { userId: user._id, text: "Stylish look ✨", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500" },
            { userId: user._id, text: "Graceful beauty 💃", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500" },
            { userId: user._id, text: "Elegant look 👑", imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=500" },
            { userId: user._id, text: "Stylish Man 🕴️", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500" },
            { userId: user._id, text: "Casual vibes 😎", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" },
            { userId: user._id, text: "Confident look 🔥", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500" },
            { userId: user._id, text: "Gentleman 🎩", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500" },
            { userId: user._id, text: "Outdoor portrait 🌲", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500" }
        ];
        await Post.insertMany(dummyPosts);
        res.send("✅ 50 Posts added successfully!");
    } catch (err) { res.status(500).send("Error: " + err.message); }
});

module.exports = router;