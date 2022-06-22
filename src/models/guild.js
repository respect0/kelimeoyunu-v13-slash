module.exports = mongoose.model("guild", mongoose.Schema(
    {
        id: { type: String, unique: true },
        game: { type: Object, default: { channel: undefined, status: false } },
    }
))