"use client";

import Stomp from "stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Player, Role } from "@/app/types";
import ImpostorView from "./ImpostorView";
import CrewmateView from "./CrewmateView";
import MapDisplay from "./MapDisplay";
import useGame from "@/state/useGame";
import { useParams } from "next/navigation";
import GameOver from "./GameOver";
import { fetchGame } from "./actions";
import GameService from "@/services/GameService";

export default function PlayGame() {
  const { gameCode } = useParams();
  console.log("gameCode: ", gameCode);
  const [stompClient, setStompClient] = useState<any>(null);
  const { game, updateGame } = useGame();
  const playerId = sessionStorage.getItem("playerId");
  const playerIndex = game?.players.findIndex(
    (player) => player.id.toString() === playerId
  );
  const currentPlayer = game?.players.find(
    (player) => player.id.toString() === playerId
  );
  const playerRole = game?.players[playerIndex as number]?.role;

  async function loadGameData() {
    const result = await fetchGame(gameCode as string);
    if (JSON.stringify(result.data) !== JSON.stringify(game)) {
      updateGame(result.data);
    }
  }

  useEffect(() => {
    if (!stompClient) {
      const socket = new SockJS("http://localhost:5010/ws");
      const client = Stomp.over(socket);
      client.connect({}, () => {
        setStompClient(client);
      });

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }

    loadGameData().then((r) => console.log("Game loaded"));
  }, [stompClient]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stompClient, game?.players]);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(
        "/topic/positionChange",
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          updateGame(receivedMessage);
        }
      );

      stompClient.subscribe(
        `/topic/${game?.gameCode}/kill/${playerId}`,
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("Subscribed Kill, Received: ", receivedMessage);
          updateGame(receivedMessage);
        }
      );
    }
  }, [stompClient]);

  function handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const validKeyCodes = ["KeyA", "KeyW", "KeyD", "KeyS"];
    if (playerId && validKeyCodes.includes(keyCode) &&
      playerRole !== Role.CREWMATE_GHOST &&
      playerRole !== Role.IMPOSTOR_GHOST) {
      const moveMessage = {
        id: playerId,
        keyCode: keyCode,
        gameCode: game?.gameCode,
      };
        
      const currentPlayer = game?.players[playerIndex as number];
      if (stompClient && (game?.players?.length ?? 0) > 0 && playerId) {
        stompClient.send("/app/move", {}, JSON.stringify(moveMessage));

      }
    }
  }

  async function killPlayer(gameCode: string, playerToKillId: number) {
    const killMessage = {
      gameCode: gameCode,
      playerToKillId: playerToKillId,
    };
    if (stompClient) {
      stompClient.send(`/app/game/kill`, {}, JSON.stringify(killMessage));
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <h4>List of players:</h4>
      <ul>
        {game?.players.map((player) => (
          <li key={player.id}>
            Username: {player.username}
            {player.id.toString() === playerId ? " (you)" : ""}
          </li>
        ))}
      </ul>

      {currentPlayer ? (
        <div>
          {playerRole === Role.IMPOSTOR ? (
            <ImpostorView
              sabotages={game?.sabotages}
              map={game?.map as boolean[][]}
              playerList={game?.players as Player[]}
              currentPlayer={currentPlayer}
              game={game}
              killPlayer={killPlayer}
            />
          ) : playerRole === Role.CREWMATE_GHOST ? (
            <GameOver />
          ) : (
            <CrewmateView
              map={game?.map as boolean[][]}
              playerList={game?.players as Player[]}
              currentPlayer={currentPlayer}
            />
          )}
          <MapDisplay
            map={game?.map as boolean[][]}
            playerList={game?.players as Player[]}
            currentPlayer={currentPlayer}
          />
        </div>
      ) : (
        <div>No Player Data Found</div>
      )}
    </div>
  );
}
