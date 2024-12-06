const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        user_id: mongoose.Schema.ObjectId,
        page_history: {
            lesson: {
                type: Number,
                required: [true, "Lesson is required"],
                default: 0,
            },
            page: {
                type: Number,
                required: [true, "Page is required"],
                default: 0,
            },
        },

        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        roadmap: [
            {
                heading: {
                    type: String,
                    required: [true, "Heading is required"],
                    trim: true,
                },
                subhead: {
                    type: String,
                    required: [true, "Sub-heading is required"],
                    trim: true,
                },
                reference_link: {
                    type: String,
                    required: [true, "Reference link is required"],
                    trim: true,
                },
                list: [
                    {
                        name: {
                            type: String,
                            required: [true, "List item name is required"],
                            trim: true,
                        },
                        indepth: {
                            type: String,
                            required: [true, "List item indepth field is required"],
                            trim: true,
                        },
                    },
                ],
                questions: [
                    {
                        type: mongoose.Schema.Types.Mixed,
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const subjectModel = mongoose.models.Subjects || mongoose.model("Subjects", subjectSchema);

export default subjectModel;