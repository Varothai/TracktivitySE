// src/utils/formatDate.ts

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};
