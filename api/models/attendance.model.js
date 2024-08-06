import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    teacherName: {
        type: String,
        required: true,
    },
    numberOfPresents: {
        type: Number,
        required: true,
    },
    numberOfAbsents: {
        type: Number,
        required: true,
    },
    days: {
        type: [String],
        required: true,
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
