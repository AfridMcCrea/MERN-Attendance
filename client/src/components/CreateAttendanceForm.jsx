import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Checkbox, Label, TextInput, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function CreateAttendanceForm() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        subjectName: "",
        teacherName: "",
        numberOfPresents: "",
        numberOfAbsents: "",
        days: []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleCheckboxChange = (day) => {
        setForm((prevForm) => ({
            ...prevForm,
            days: prevForm.days.includes(day)
                ? prevForm.days.filter((d) => d !== day)
                : [...prevForm.days, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/attendance/createattendance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: currentUser._id,
                    ...form
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setIsModalOpen(true); // Open the modal
        } catch (error) {
            console.error(error);
            alert("An error occurred while creating the attendance record.");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddNewRecord = () => {
        setForm({
            subjectName: "",
            teacherName: "",
            numberOfPresents: "",
            numberOfAbsents: "",
            days: []
        });
        setIsModalOpen(false);
    };

    const handleNavigateHome = () => {
        setIsModalOpen(false);
        navigate("/");
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <div>
                <div className="mb-5">
                    <h1 className="mt-7 text-center font-semibold text-xl">
                        Create Attendance Record
                    </h1>
                    <p className="text-center italic text-md">
                        for {currentUser.username}
                    </p>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <Label value="Subject Name" />
                    <TextInput
                        type="text"
                        name="subjectName"
                        placeholder="Enter subject name/code here..."
                        value={form.subjectName}
                        onChange={handleChange}
                    />
                    <Label value="Teacher Name" />
                    <TextInput
                        type="text"
                        name="teacherName"
                        placeholder="Enter teacher's name here..."
                        value={form.teacherName}
                        onChange={handleChange}
                    />
                    <Label value="Presents" />
                    <TextInput
                        type="text"
                        name="numberOfPresents"
                        placeholder="0"
                        value={form.numberOfPresents}
                        onChange={handleChange}
                    />
                    <Label value="Absents" />
                    <TextInput
                        type="text"
                        name="numberOfAbsents"
                        placeholder="0"
                        value={form.numberOfAbsents}
                        onChange={handleChange}
                    />
                    <div className="flex flex-wrap gap-4 mt-3 border border-yellow-300 p-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                            <div className="flex" key={day}>
                                <Label value={day} />
                                <Checkbox
                                    className="ml-1 mt-[3px]"
                                    checked={form.days.includes(day)}
                                    onChange={() => handleCheckboxChange(day)}
                                />
                            </div>
                        ))}
                    </div>
                    <Button gradientDuoTone="redToYellow" type="submit">Submit Record</Button>
                </form>

                {/* Modal */}
                <Modal show={isModalOpen} onClose={handleModalClose}>
                    <Modal.Header>Attendance Record Created</Modal.Header>
                    <Modal.Body>
                        <p>Do you want to add another record?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleAddNewRecord}>Yes</Button>
                        <Button color="gray" onClick={handleNavigateHome}>No</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
