import { API_URL } from "@/config";
import axios from "axios";
import { IUser, IUserUpdate } from "./profile.types";
const API = `${API_URL}/profile`;

export const getProfile = async () => {
    const result: { data: IUser } = await axios.get(`${API}`);
    return result.data;
};

export const updateProfile = async (data: IUserUpdate) => {
    const result: { data: IUser } = await axios.put(`${API}`, data);
    return result.data;
};
