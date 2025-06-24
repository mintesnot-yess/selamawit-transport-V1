import api from '@/api';
import apiEndPoints from '@/components/constants';
// import { useProfileStore } from '@/stores/profile';
import axios from 'axios';

const   useRoleStore = {
    // Get all roles
    async getAll(params = {page:null,perPage:null,search:null}) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndPoints.roles}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                params: {
                    page: params.page || 1,
                    per_page: params.perPage || 15, // Match your frontend default
                    search: params.search || ''
                }
            });

            // Transform response if needed
            const responseData = response.data;

            // If API returns data directly without meta wrapper
            if (Array.isArray(responseData)) {
                return {
                    data: responseData,
                    meta: {
                        current_page: 1,
                        per_page: params.perPage || 5,
                        total: responseData.length,
                        last_page: 1,
                        from: 1,
                        to: responseData.length
                    }
                };
            }

            // If API returns items/pagination instead of data/meta
            if (responseData.items && responseData.pagination) {
                return {
                    data: responseData.items,
                    meta: responseData.pagination
                };
            }

            // If already in correct format
            if (responseData.data && responseData.meta) {
                return responseData;
            }

            throw new Error('Unexpected API response format');

        } catch (error) {
            // throw this.handleError(error);
        }
    },

    async getAllRole() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndPoints.user}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },

            });

    //         // Transform response if needed
            const responseData = response.data;

    //         // const profile = useProfileStore();
    //         // profile.user = response.data;
    //         // If API returns data directly without meta wrapper
            if (Array.isArray(responseData)) {
                return {
                    data: responseData,
                    meta: {
                        current_page: 1,
                        per_page:  5,
                        total: responseData.length,
                        last_page: 1,
                        from: 1,
                        to: responseData.length
                    }
                };
            }

    //         // If API returns items/pagination instead of data/meta
            if (responseData.items && responseData.pagination) {
                return {
                    data: responseData.items,
                    meta: responseData.pagination
                };
            }

    //         // If already in correct format
            if (responseData.data && responseData.meta) {
                return responseData;
            }

            throw new Error('Unexpected API response format');

        } catch (error) {
         }
    },

    // Create a new user
    async register(userData:[]) {
        try {

            const response = await api.post(apiEndPoints.user, userData);
            console.log(apiEndPoints.user);

            return response.data;

        } catch (error:any) {
            throw new Error(
                error.response?.data?.message ||
                error.response?.data?.errors ||
                "Registration failed",
            );
        }
    },

    // // Update a user
    // async update(id, userData) {
    //     try {
    //         const response = await axios.put(`${API_BASE_URL}/roles/${id}`, userData, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw this.handleError(error);
    //     }
    // },

    // // Delete a user
    // async delete(id) {
    //     try {
    //         const response = await axios.delete(`${API_BASE_URL}/roles/${id}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw this.handleError(error);
    //     }
    // },

    // // multiple Delete a user
    // async bulkDelete(ids) {
    //     try {
    //         const response = await axios.delete(`${API_BASE_URL}/roles/bulk`, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    //             },
    //             data: ids,

    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw this.handleError(error);
    //     }
    // },

    // // Search roles
    // async search(params = {}) {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/roles/search`, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    //             },
    //             params: {
    //                 q: params.query || '',
    //                 page: params.page || 1,
    //                 per_page: params.perPage || 15
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw error.response?.data?.message || 'Search failed';
    //     }
    // },

    // // Handle API errors
    // handleError(error) {
    //     if (error.response) {
    //         // The request was made and the server responded with a status code
    //         const message = error.response.data?.message || error.response.statusText;
    //         return new Error(message || 'Role operation failed');
    //     } else if (error.request) {
    //         // The request was made but no response was received
    //         return new Error('No response from server. Please check your connection.');
    //     } else {
    //         // Something happened in setting up the request
    //         return new Error(error.message || 'Error configuring user request');
    //     }
    // }
};

export default useRoleStore;