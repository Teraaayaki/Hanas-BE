import mongoose from 'mongoose';

const favoritesModel = mongoose.Schema(
    {
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        favorite_workers: [{type: mongoose.Schema.Types.ObjectId, ref: "MyService" }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Favorites", favoritesModel);