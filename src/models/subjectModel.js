const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        roadmap: [
            {
                heading: {
                    type: String,
                    required: [true, "Heading is required"],
                    trim: true,
                },
                "sub-h": {
                    type: String,
                    required: [true, "Sub-heading is required"],
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
                    [
                        {
                            type: mongoose.Schema.Types.Mixed,
                        },
                    ],
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const subjectModel = mongoose.models.Subjects  || mongoose.model("Subjects", subjectSchema);

export default subjectModel;