import express from 'express';
import { createAttendance, deleteAttendanceRecord, getAttendanceByDay, updateAttendance, updateAttendanceDetails } from '../controllers/attendance.controller.js';

const router = express.Router();

router.post('/createattendance', createAttendance);
router.get('/attendance', getAttendanceByDay);  // Updated this line
router.patch('/attendance/:subjectId', updateAttendance);  // Updated this line
router.put('/:subjectId', updateAttendanceDetails);
router.delete('/deleteattendance/:subjectId', deleteAttendanceRecord);
export default router;
