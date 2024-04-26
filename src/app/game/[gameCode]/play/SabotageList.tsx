import { useEffect, useState } from "react";
import SabotageListItem from "./SabotageListItem";
import { Sabotage } from "@/app/types";

type Props = {
  sabotages: Sabotage[];
  gameCode: string;
  mapName: string;
};

export default function SabotageList({ sabotages, gameCode, mapName }: Props) {
  const [incompleteSabotages, setIncompleteSabotages] =
    useState<Sabotage[]>(sabotages);
  const [completedSabotages, setCompletedSabotages] = useState<Sabotage[]>([]);
  const [isSabotageCooldown, setIsSabotageCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(30);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (isSabotageCooldown) {
      countdownInterval = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isSabotageCooldown]);

  function handleSabotageComplete(sabotageId: number) {
    if (!isSabotageCooldown) {
      const sabotageIndex = incompleteSabotages.findIndex(
        (sabotage) => sabotage.id === sabotageId
      );
      if (sabotageIndex !== -1) {
        const completedSabotage = incompleteSabotages[sabotageIndex];
        setCompletedSabotages([...completedSabotages, completedSabotage]);
        const updatedSabotages = incompleteSabotages.filter(
          (sabotage) => sabotage.id !== sabotageId
        );
        setIncompleteSabotages(updatedSabotages);
        setIsSabotageCooldown(true);
        setTimeout(() => {
          setIsSabotageCooldown(false);
          setCooldownTime(30);
        }, 30000);
      }
    }
  }

  // async function getSabotagePosition(completedSabotage: Sabotage) {
  //   const sabotageMessage = {
  //     gameCode: gameCode,
  //     sabotageId: completedSabotage.id,
  //     map: mapName,
  //   };
  //   console.log(sabotageMessage);
  //   if(stompClient) {
  //     stompClient.send(`/app/game/sabotage`, {}, JSON.stringify(sabotageMessage));
  //   }
  // } todo move to page.tsx




  const displayedSabotages = incompleteSabotages.slice(0, 2);

  return (
    <div className="relative">
      {isSabotageCooldown && (
        <div className="absolute inset-0 bg-gray-500 opacity-50 flex justify-center items-center">
          <div className={"text-white text-lg font-semibold"}>
            Cooldown {cooldownTime}s
          </div>
        </div>
      )}
      <div className="bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-lg min-h-64">
        <h2 className="text-lg font-semibold mb-4">Sabotages</h2>
        <ul className="overflow-x-hidden">
          {displayedSabotages.map((sabotage) => (
            <SabotageListItem
              key={sabotage.id}
              sabotage={sabotage}
              onComplete={() => handleSabotageComplete(sabotage.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
