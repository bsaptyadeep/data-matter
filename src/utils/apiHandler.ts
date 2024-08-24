import axios from 'axios';
import { SERVER_BASE_URL } from '../constants';

// interface ApiResponse<T> {
//     data: T;
// }

interface ApiError {
    message: string;
    detail?: string
}


export const apiClient = async (method: string, endPoint: string, data: any) => {
    try {
        const access_token = localStorage.getItem('access_token');

        const response = await axios({
            method,
            url: `${SERVER_BASE_URL}${endPoint}`,
            data,
            headers: {
                Authorization: `Bearer ${access_token}`,
                "x-custom-header": "custom"
            }
        })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle AxiosError
            const apiError: ApiError = {
                message: error.message,
                detail: error.response?.data.detail
            };
            return apiError;
        } else {
            // Handle other types of errors
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}