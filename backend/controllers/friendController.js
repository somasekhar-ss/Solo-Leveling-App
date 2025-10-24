const User = require('../models/User');

exports.addFriend = async (req, res) => {
  const { username } = req.body;
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ msg: 'User not found.' });
    const friend = await User.findOne({ username });
    if (!friend) return res.status(404).json({ msg: 'Friend user not found.' });
    if (me.friends.includes(friend._id)) return res.status(400).json({ msg: 'Already friends.' });
    me.friends.push(friend._id);
    await me.save();
    res.json({ msg: 'Friend added.', friend: { _id: friend._id, username: friend.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error adding friend.');
  }
};

exports.listFriends = async (req, res) => {
  try {
    const me = await User.findById(req.user.id).populate('friends', 'username level');
    res.json(me.friends || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error listing friends.');
  }
};

exports.removeFriend = async (req, res) => {
  const { friendId } = req.params;
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ msg: 'User not found.' });
    me.friends = me.friends.filter(f => f.toString() !== friendId);
    await me.save();
    res.json({ msg: 'Friend removed.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error removing friend.');
  }
};
