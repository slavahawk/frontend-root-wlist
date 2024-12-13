export const handleError = (error: any, toast: any) => {
    const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка';
    toast.add({
        severity: 'error',
        summary: errorMessage,
        life: 3000
    });
    console.error('Error occurred:', error);
};
