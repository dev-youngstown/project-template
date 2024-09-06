import { API_URL } from "@/config";
import axios from "axios";
import { ICreateUser } from "./auth.types";
const API = `${API_URL}/user`;

export const forgotPassword = async (email: string) => {
    const result = await axios.post(`${API}/password/forgot/${email}`);
    return result.data;
};

export const resetPassword = async (data: {
    token: string;
    new_password: string;
}) => {
    const result = await axios.post(`${API}/password/reset`, data);
    return result.data;
};

export const registerUser = async (data: ICreateUser) => {
    const result = await axios.post(`${API}/register`, data);
    return result.data;
};

export const login = async (email: string, password: string) => {
    const result: { data: { access_token: string; token_type: string } } =
        await axios.post(`${API}/login`, {
            email,
            password,
        });
    return result.data;
};

export const changePassword = async (
    current_password: string,
    new_password: string
) => {
    try {
        const result = await axios.put(`${API}/password/change`, {
            current_password,
            new_password,
        });
        return result.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
