import {useToast} from "primevue/usetoast";

export const handleError = (error: any) => {
    const toast = useToast()
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
    toast.add({
        severity: 'error',
        summary: errorMessage,
        life: 3000
    });
    console.error('Error occurred:', error);
};
