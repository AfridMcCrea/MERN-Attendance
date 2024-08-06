import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import CreateAttendanceForm from "./CreateAttendanceForm";

export default function DashAttendance() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <CreateAttendanceForm/>
  );
}
