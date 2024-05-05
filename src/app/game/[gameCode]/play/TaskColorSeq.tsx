import React, { useState, useEffect } from 'react';
import TaskCompletedPopup from "@/app/game/[gameCode]/play/TaskCompletedPopup";
import MiniGameColorSeqService from "@/services/MiniGameColorSeqService";

type TaskColorSeqProps = {
    taskId: number;
    gameCode: string;
    handleTaskCompleted: (taskId: number) => void;
};

export default function TaskColorSeq({taskId, gameCode, handleTaskCompleted}: TaskColorSeqProps) {
    const [shuffledColors, setShuffledColors] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [isShowTaskCompletedPopUp, setIsShowTaskCompletedPopUp] = useState<boolean>(false);
    const [InitialColors, setInitialColors] = useState<string[]>([]);

    useEffect(() => {
        const initializeGame = async () => {
            try {
                const initialColors = await MiniGameColorSeqService.getInitialColors(gameCode, taskId);
                setInitialColors(initialColors);
                const shuffledColors = await MiniGameColorSeqService.getShuffledColors(gameCode, taskId);
                setShuffledColors(shuffledColors);
            } catch (err) {
                console.error('Failed to fetch shuffled colors:', err);
            }
        };

        initializeGame();
    }, [gameCode, taskId]);

    const handleColorClick = (color: string) => {
        if (selectedColors.length < 4) {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const handleUndo = () => {
        setSelectedColors(selectedColors.slice(0, -1));
    };

    const handleSubmission = async () => {
        const result = await MiniGameColorSeqService.submitColorSequence(selectedColors, shuffledColors, taskId, gameCode);
        if (result) {
            setIsShowTaskCompletedPopUp(true);
        } else {
            alert('Task not completed');
        }
    };

    function onClose() {
        setIsShowTaskCompletedPopUp(false);
        handleTaskCompleted(taskId);
    }

    return (
        <>
            {isShowTaskCompletedPopUp ? (
                <TaskCompletedPopup onClose={onClose} />
            ) : (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="flex flex-col items-center bg-black rounded-lg p-8 max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Task: Color Code</h2>
                        <p className="text-lg">Select the right order of Colors:</p>
                        <div className="flex gap-2 mt-2">
                            {InitialColors.map((color, index) => (
                                <div key={index} className="cursor-pointer w-12 h-12 border border-white" style={{ backgroundColor: color }} onClick={() => handleColorClick(color)}></div>
                            ))}
                        </div>
                        <p className="text-lg">Right order:</p>
                        <div className="flex gap-2 mt-2">
                            {shuffledColors.map((color, index) => (
                                <div key={index} className="w-12 h-12 border border-white" style={{ backgroundColor: color }}></div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            {selectedColors.map((color, index) => (
                                <div key={index} className="w-5 h-5 border border-white" style={{ backgroundColor: color }}></div>
                            ))}
                        </div>
                        <div className="flex w-full justify-between mt-4 gap-2">
                            <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-lg" onClick={handleUndo}>Undo</button>
                            <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-lg" onClick={handleSubmission}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}