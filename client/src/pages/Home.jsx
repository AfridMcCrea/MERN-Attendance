import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import WeeklyCalendar from "../components/WeeklyCalander"; // Import the WeeklyCalendar component

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const HomePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentDay, setCurrentDay] = useState(
    daysOfWeek[new Date().getDay() - 1]
  );
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchSubjectsForDay(currentDay);
    }
  }, [currentDay, currentUser]);

  const fetchSubjectsForDay = async (day) => {
    try {
      const response = await fetch(
        `/api/attendance/attendance?userId=${currentUser._id}&day=${day}`
      );
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        console.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.error("An error occurred while fetching subjects", error);
    }
  };

  const handleUpdateAttendance = async (subjectId, type) => {
    try {
      const response = await fetch(`/api/attendance/attendance/${subjectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        fetchSubjectsForDay(currentDay);
      } else {
        console.error("Failed to update attendance");
      }
    } catch (error) {
      console.error("An error occurred while updating attendance", error);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const response = await fetch(`/api/attendance/deleteattendance/${subjectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchSubjectsForDay(currentDay);
      } else {
        console.error("Failed to delete subject");
      }
    } catch (error) {
      console.error("An error occurred while deleting subject", error);
    }
  };


  const calculateAttendance = (presents, absents) => {
    const totalClasses = presents + absents;
    if (totalClasses === 0) return 0;
    return (presents / totalClasses) * 100;
  };

  const getAttendanceInfo = (presents, absents) => {
    const totalClasses = presents + absents;
    const attendancePercentage = calculateAttendance(presents, absents);
    const requiredPercentage = 75;
    let classesToMiss = 0;
    let classesToAttend = 0;

    if (attendancePercentage >= requiredPercentage) {
      classesToMiss = Math.floor(
        (presents - (requiredPercentage * totalClasses) / 100) /
          (requiredPercentage / 100)
      );
    } else {
      classesToAttend = Math.ceil(
        ((requiredPercentage * totalClasses) / 100 - presents) /
          (1 - requiredPercentage / 100)
      );
    }

    return { attendancePercentage, classesToMiss, classesToAttend };
  };

  const getCurrentDateInfo = () => {
    const today = new Date();
    const day = today.toLocaleDateString("en-US", { weekday: "long" });
    const date = today.getDate();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const year = today.getFullYear();
    return { day, date, month, year };
  };

  const { day, date, month, year } = getCurrentDateInfo();

  
  const handleEdit = (subject) => {
    navigate(`/editattendance/${subject._id}`, { state: { subject } });
  };

  return (
    <div className="p-3 gap-2">
      <div className="flex flex-col items-center mb-4">
        <span className="text-xl shadow-lg px-8 py-2 rounded-full bg-yellow-300 dark:text-black ">{`${date} ${month} ${year}`}</span>
      </div>
      <WeeklyCalendar currentDay={currentDay} onSelectDay={setCurrentDay} />
      {subjects.length > 0 ? (
        subjects.map((subject) => {
          const { attendancePercentage, classesToMiss, classesToAttend } =
            getAttendanceInfo(
              subject.numberOfPresents,
              subject.numberOfAbsents
            );
          return (
            <div
              key={subject._id}
              className="border border-yellow-300  rounded-lg p-4 mb-2 relative"
            >
              <h2 className="font-semibold text-xl">{subject.subjectName}</h2>
              <p className="italic text-sm text-gray-500">
                by {subject.teacherName}
              </p>
              <div className="flex gap-4 p-2 items-center justify-center">
                <div className="bg-pink-500 text-white border border-pink-500  h-[120px] w-[110px] rounded-lg">
                  <p className="mt-0 p-1"> Presents</p>
                  <h1 className=" ml-3 mt-[12px] text-[60px] p-2">
                    {subject.numberOfPresents}
                  </h1>
                </div>
                <div className="bg-blue-500 text-white border border-blue-500  h-[120px] rounded-lg w-[110px]">
                  <p className="mt-0 p-1"> Absents</p>
                  <h1 className=" ml-3 text-[60px] mt-[12px] p-2">
                    {subject.numberOfAbsents}
                  </h1>
                </div>
              </div>

              <div className="progress-bar bg-gray-200 h-6 rounded-full overflow-hidden mb-2 shadow-lg">
                <div
                  className="bg-green-400 h-full shadow-lg"
                  style={{ width: `${attendancePercentage}%` }}
                >
                  <p className="mx-[200px]">
                    {attendancePercentage.toFixed(2)}
                  </p>
                </div>
              </div>
              {attendancePercentage >= 75 ? (
                classesToMiss === 0 ? (
                  <p className="p-2 italic ml-[40px]">
                    You can't miss any more classes.
                  </p>
                ) : (
                  <p className="p-2 italic ml-[40px]">
                    You can miss {classesToMiss} more class
                    {classesToMiss !== 1 ? "es" : ""}.
                  </p>
                )
              ) : (
                <p className="p-2 italic ml-[5px]">
                  You need to attend {classesToAttend} more class
                  {classesToAttend !== 1 ? "es" : ""} to reach 75%.
                </p>
              )}
              <div className="items-center justify-center mx-[100px]">
                <button
                  className="bg-pink-500 text-white p-2 mr-2 rounded-md"
                  onClick={() => handleUpdateAttendance(subject._id, "present")}
                >
                  Present
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded-md"
                  onClick={() => handleUpdateAttendance(subject._id, "absent")}
                >
                  Absent
                </button>
              </div>
              <button
                className="absolute top-2 right-2"
                onClick={() => handleEdit(subject)}
              >
                <FaEdit />
              </button>
              <button
                className="absolute top-2 right-10 text-red-500"
                onClick={() => handleDeleteSubject(subject._id)}
              >
                <FaTrash />
              </button>
            </div>
          );
        })
      ) : (
        <p className="p-28">No subjects for today.</p>
      )}
    </div>
  );
};

export default HomePage;
