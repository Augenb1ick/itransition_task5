import { CountryType } from '../models/country';

export const API_URL = 'https://testing-web.site';

export const MAX_ERR_RATE = '1000';
export const MAX_SEED_VALUE = '99999999';
export const ERR_RATE_DECIMAL_PLACES = 2;
export const MAX_RANDOM_SEED = 10000000;

export const sanitizeValue = (value: string, isFloat: boolean) => {
    let sanitizedValue;
    isFloat
        ? (sanitizedValue = value.replace(/[^0-9.]/g, ''))
        : (sanitizedValue = value.replace(/[^0-9]/g, ''));
    return sanitizedValue;
};

export const countries: readonly CountryType[] = [
    { code: 'RU', label: 'Russia' },
    { code: 'DE', label: 'Germany' },
    { code: 'FR', label: 'France', suggested: true },
];
