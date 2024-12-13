import api from "@/api/api.ts";
import type {User} from "@/types/user.ts";

export class AuthService {
    static async auth(body: { email: string; password: string }): Promise<User> {
        try {
            const { data } = await api.post('/auth', body);
            return data;
        } catch (error) {
            console.error('Authentication error:', error);
            throw new Error('Authentication failed');
        }
    }

    static async register(body: { email: string; password: string; role: string; shopId: number }): Promise<User> {
        try {
            const { data } = await api.post('/auth/register', body);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Registration failed');
        }
    }

    static async refresh(refreshToken: string): Promise<User> {
        try {
            const { data } = await api.post('/auth/refresh', { refreshToken });
            return data;
        } catch (error) {
            console.error('Refresh token error:', error);
            throw new Error('Token refresh failed');
        }
    }

    static async logout(refreshToken: string): Promise<void> {
        try {
            await api.post('/auth/logout', { refreshToken });
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Logout failed');
        }
    }
}

