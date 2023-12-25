import { stat } from 'fs/promises';

export const pathExists = async (path: string): Promise<boolean> => {
    return stat(path)
        .then(() => true)
        .catch(() => false);
};
