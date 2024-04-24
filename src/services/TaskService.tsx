import { ApiResponse } from "@/app/types";
import ApiService from "./ApiService";

export default class TaskService {
    static async sumUp(value: number) {
        const currentSum = await ApiService.post("task", `/api/task/passcode/add`, { value });
        console.log("Sum:", currentSum);
        return currentSum as ApiResponse<number>;
    }

    static async getRandomSum() {
        const randomSum = await ApiService.get("task", `/api/task/passcode/random`);
        console.log("Random sum:", randomSum);
        return randomSum as ApiResponse<number>;
    }

    static async resetSum() {
        const currentSum = await ApiService.post("task", `/api/task/passcode/reset`);
        console.log("Reset sum:", currentSum);
        return currentSum as ApiResponse<number>;
    }

    static async getCurrentSum() {
        const currentSum = await ApiService.get("task", `/api/task/passcode/current`);
        console.log("Current sum:", currentSum);
        return currentSum as ApiResponse<number>;
    }
}