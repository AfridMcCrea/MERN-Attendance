import Attendance from "../models/attendance.model.js";
import { errorHandler } from "../utils/error.js";

export const createAttendance = async (req, res, next) => {
    const { userId, subjectName, teacherName, numberOfPresents, numberOfAbsents, days } = req.body;

    if (!userId || !subjectName || !teacherName || !numberOfPresents || !numberOfAbsents || !days) {
        return next(errorHandler(400, 'All fields are required'));
    }

    const newAttendance = new Attendance({
        userId,
        subjectName,
        teacherName,
        numberOfPresents,
        numberOfAbsents,
        days,
    });

    try {
        await newAttendance.save();
        res.status(200).json('Record created successfully');
    } catch (error) {
        next(error);
    }
};

export const getAttendanceByDay = async (req, res, next) => {
    const { userId, day } = req.query;

    try {
        const records = await Attendance.find({
            userId,
            days: day,
        });
        res.status(200).json(records);
    } catch (error) {
        next(error);
    }
};

export const updateAttendance = async (req, res, next) => {
    const { subjectId } = req.params;
    const { type } = req.body;

    try {
        const attendance = await Attendance.findById(subjectId);

        if (!attendance) {
            return next(errorHandler(404, "Attendance record not found"));
        }

        if (type === "present") {
            attendance.numberOfPresents += 1;
        } else if (type === "absent") {
            attendance.numberOfAbsents += 1;
        } else {
            return next(errorHandler(400, "Invalid type"));
        }

        await attendance.save();
        res.status(200).json("Attendance updated successfully");
    } catch (error) {
        next(error);
    }
};

export const updateAttendanceDetails = async (req, res, next) => {
    const { subjectId } = req.params;
    const { subjectName, teacherName, numberOfPresents, numberOfAbsents, days } = req.body;

    try {
        const attendance = await Attendance.findById(subjectId);

        if (!attendance) {
            return next(errorHandler(404, "Attendance record not found"));
        }

        if (subjectName) attendance.subjectName = subjectName;
        if (teacherName) attendance.teacherName = teacherName;
        if (numberOfPresents !== undefined) attendance.numberOfPresents = numberOfPresents;
        if (numberOfAbsents !== undefined) attendance.numberOfAbsents = numberOfAbsents;
        if (days) attendance.days = days;

        await attendance.save();
        res.status(200).json("Attendance details updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteAttendanceRecord = async (req, res , next) => {
    try {
        const { subjectId } = req.params;
        const attendance = await Attendance.findById(subjectId);

        if (!attendance) {
            next(errorHandler(400, 'Attendance record not found'));
        }

        await Attendance.findByIdAndDelete(subjectId);
        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        next(error);
    }
};