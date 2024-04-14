import { Sabotage } from "@/app/types";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import SabotageList from "./SabotageList";
import RoleInformation from "./RoleInformation";
import KillButton from "./KillButton";

type Props = {
  sabotages: Sabotage[];
};

export default function ImpostorView({ sabotages }: Props) {
  const [disabled, setDisabled] = useState(false);

  function handleKill() {
    // Show toast notification for the kill
    toast("You killed a crewmate!", {
      position: "bottom-right",
      style: {
        border: "2px solid black", // Red border
        padding: "16px",
        color: "black", // Text color
        backgroundColor: "#eF4444", // Red background
      },
      icon: "🔪",
    });

    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 20000);
  }

  return (
    <div className="flex justify-between items-start p-4">
      <div className="flex-none">
        <SabotageList sabotages={sabotages} />
      </div>

      {/* Role Information in top center */}
      <div className="flex-grow flex justify-center">
        <RoleInformation role={"IMPOSTOR"} />
      </div>

      {/* Map Button on top right */}
      <div className="flex-none">
        <p>Map Button Component Goes Here</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <KillButton handleKill={handleKill} disabled={disabled} />
      </div>
      <Toaster />
    </div>
  );
}
