import { useState } from 'react';

export interface RestaurantInfo {
    name: string;
    address: string;
    gstin: string;
    phone: string;
}

const DEFAULT_INFO: RestaurantInfo = {
    name: 'Tanisha Restaurant',
    address: 'YCWM college road, Warananagar',
    gstin: '2***********1Z5',
    phone: '',
};

const STORAGE_KEY = 'restaurant_info';

export const useRestaurantInfo = () => {
    const [info, setInfo] = useState<RestaurantInfo>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...DEFAULT_INFO, ...JSON.parse(stored) } : DEFAULT_INFO;
        } catch {
            return DEFAULT_INFO;
        }
    });

    const updateInfo = (updates: Partial<RestaurantInfo>) => {
        const newInfo = { ...info, ...updates };
        setInfo(newInfo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newInfo));
    };

    return { info, updateInfo };
};
