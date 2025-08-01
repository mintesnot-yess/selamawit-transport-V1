 import apiEndPoints from '@/components/constants';
 import axios from 'axios';

const  useLoadTypeStore = {

    // Get all LoadTypes
    async getAll(params:any = {}) {
        try {

            const response = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndPoints.loadTypes}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                params: {
                    page: params.page || 1,
                    per_page: params.perPage || 15,
                    search: params.search || ''
                }
            });

            const responseData = response.data;

            if (Array.isArray(responseData)) {
                return {
                    data: responseData,
                    meta: {
                        current_page: 1,
                        per_page: params.perPage || 15,
                        total: responseData.length,
                        last_page: 1,
                        from: 1,
                        to: responseData.length
                    }
                };
            }

            if (responseData.items && responseData.pagination) {
                return {
                    data: responseData.items,
                    meta: responseData.pagination
                };
            }

            if (responseData.data && responseData.meta) {
                return responseData;
            }

            throw new Error('Unexpected API response format');

        } catch (error) {
            throw this.handleError(error);
        }
    },
    // async getById(id)

    // Create a new LoadType
    async store(LoadTypeData:[]) {
        try {
            const formData = new FormData();
            for (const key in LoadTypeData) {
                formData.append(key, LoadTypeData[key]);
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}${apiEndPoints.loadTypes}`, LoadTypeData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },
    // Get a LoadType by ID
    async getById(id:any) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndPoints.loadTypes}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Update a LoadType by ID
    async update(id:any, LoadTypeData:[]) {
        try {
            const formData = new FormData();
            for (const key in LoadTypeData) {
                formData.append(key, LoadTypeData[key]);
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}${apiEndPoints.loadTypes}/${id}?_method=PUT`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Delete a LoadType by ID
    async delete(id:any) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}${apiEndPoints.loadTypes}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    handleError(error:any) {
        if (error.response && error.response.data && error.response.data.message) {
            return new Error(error.response.data.message);
        }
        return new Error(error.message || 'An unknown error occurred');
    }

};

export default  useLoadTypeStore;