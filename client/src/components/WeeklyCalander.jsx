import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const WeeklyCalendar = ({ currentDay, onSelectDay }) => {
  return (
    <div className="flex justify-around mb-4">
      {daysOfWeek.map((day, index) => (
        <div
          key={index}
          className={`p-2 text-center cursor-pointer ${
            currentDay === day
              ? "bg-yellow-300 dark:text-black"
              : "bg-gray-200 dark:bg-black"
          }`}
          onClick={() => onSelectDay(day)}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;
