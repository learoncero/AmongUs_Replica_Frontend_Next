import React from "react";

interface TaskPopupProps {
    onClose: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
            <div className="bg-black rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4"> Passcode </h2>
                <div className="mb-4">
                    <p className="text-lg">Sum to be achieved: 30</p>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-4">
                    {[...Array(10)].map((_, index) => (
                        <button
                            key={index + 1}
                            className="bg-gray-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="mb-4">
                    <p className="text-lg">Current sum: XXX</p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>Reset</button>
            </div>
        </div>
    );
};

export default TaskPopup;
