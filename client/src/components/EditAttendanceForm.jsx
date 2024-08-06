import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

const EditAttendanceForm = () => {
    const location = useLocation();
    const { subject } = location.state;
    const [subjectName, setSubjectName] = useState(subject.subjectName);
    const [teacherName, setTeacherName] = useState(subject.teacherName);
    const [numberOfPresents, setNumberOfPresents] = useState(subject.numberOfPresents);
    const [numberOfAbsents, setNumberOfAbsents] = useState(subject.numberOfAbsents);
    const [days, setDays] = useState(subject.days);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/api/attendance/${subject._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subjectName, teacherName, numberOfPresents, numberOfAbsents, days }),
            });

            if (response.ok) {
                navigate('/');
            } else {
                console.error("Failed to update attendance");
            }
        } catch (error) {
            console.error("An error occurred while updating attendance", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <div className="">
                <div className="mb-5">
                    <h1 className="mt-7 text-center font-semibold text-xl ">
                        Edit Attendance Record
                    </h1>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <Label value="Subject Name" />
                    <TextInput type="text" placeholder="Maths" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
                    <Label value="Teacher Name" />
                    <TextInput type="text" placeholder="BKD hbo pare najanu kela xett" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                    <Label value="Presents" />
                    <TextInput type="number" placeholder="5" value={numberOfPresents} onChange={(e) => setNumberOfPresents(e.target.value)} />
                    <Label value="Absents" />
                    <TextInput type="number" placeholder="10" value={numberOfAbsents} onChange={(e) => setNumberOfAbsents(e.target.value)} />
                    <div className="flex flex-wrap gap-4 mt-3 border border-yellow-300 p-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                            <div key={day} className="flex">
                                <Label value={day} />
                                <Checkbox className="ml-1 mt-[3px]" checked={days.includes(day)} onChange={(e) => {
                                    if (e.target.checked) {
                                        setDays([...days, day]);
                                    } else {
                                        setDays(days.filter((d) => d !== day));
                                    }
                                }} />
                            </div>
                        ))}
                    </div>
                    <Button gradientDuoTone="redToYellow" type="submit">Update Record</Button>
                </form>
            </div>
        </div>
    );
};

export default EditAttendanceForm;
