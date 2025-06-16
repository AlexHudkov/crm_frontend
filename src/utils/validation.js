export const validateName = (value) => {
    if (value === "" || value === null) return "";
    if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(value)) {
        return "Name must contain only letters (no numbers or special characters).";
    }
};

export const validateSurname = (value) => {
    if (value === "" || value === null) return "";
    if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(value)) {
        return "Surname must contain only letters (no numbers or special characters).";
    }
};

export const validateEmail = (value) => {
    if (value === "" || value === null) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Invalid email format.";
    }
};

export const validatePhone = (value) => {
    if (value === "" || value === null) return "";
    if (!/^\+?\d{10,15}$/.test(value)) {
        return "Phone must be a valid number (10-15 digits, optional '+').";
    }
};

export const validateAge = (value) => {
    if (value && (isNaN(value) || value < 0 || value > 120)) {
        return "Age must be between 0 and 120.";
    }
};

export const validateSum = (value) => {
    if (value === "" || value === null) return "";
    if (!/^\d+$/.test(value)) {
        return "Sum must be a valid positive number.";
    }
};

export const validateAlreadyPaid = (value) => {
    if (value === "" || value === null) return "";
    if (!/^\d+$/.test(value)) {
        return "Already Paid must be a valid positive number.";
    }
};