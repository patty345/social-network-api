const { Thought, User } = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find()
        .sort({ createdAt: -1 })
        .then((dbThoughtData) => {
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'Thought with this ID does not exist' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((dbThoughtData) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: dbThoughtData._id }},
                { new: true }
            );
        })
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(400).json({ message: 'Thought has been created bu no user with this is id' });
            }
            res.json({ message: 'Thought has been created' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'Thought with this ID does not exist' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'Thought with this ID does not exist' });
            }
            return User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId }},
                { new: true}
            );
        })
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({ message: 'Thought has been created but no user with this id' });
            }
            res.json({ message: 'Thought has been deleted' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thougthId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true}
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'User with this ID doe not exist' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'Thought with this ID does not exist' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
};

module.exports = thoughtController;
