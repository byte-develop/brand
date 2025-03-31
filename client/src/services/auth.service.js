import axios from "axios";
import { instance } from "../api/axios.api"

const IMG_BB_API_KEY = '4007bef0ca3bc034d28d79572d765ec8';

export const AuthService = {
    async registration(userData) {
        const { data } = await instance.post('user', userData)
        return data
    },
    async login(userData) {
        const { data } = await instance.post('auth/login', userData)
        return data
    },
    async getMe() {
        const { data } = await instance.get('auth/profile')
        if (data) return data
    },
    async updateEmail(userData) {
        const { data } = await instance.patch('user/email', userData);
        return data;
    },
    async uploadPhoto(photoFile) {
        const formData = new FormData();
        formData.append('image', photoFile);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, formData);
            return response.data.data.url;
        } catch (error) {
            throw new Error('Ошибка загрузки изображения: ' + error.message);
        }
    },
    async updateUserProfile(userData) {
        const { data } = await instance.patch('user/photo', userData);
        return data;
    },
    async getUserPhotoById(userId) {
        const { data } = await instance.get(`user/${userId}/photo`);
        return data;
    },
    async changePassword({ userId, oldPassword, newPassword }) {
        const { data } = await instance.patch(`auth/change-password/${userId}`, { oldPassword, newPassword });
        return data;
    },
    async getFavouriteShops(userId) {
        const { data } = await instance.get(`user/${userId}/favourites`);
        return data;
    }
}