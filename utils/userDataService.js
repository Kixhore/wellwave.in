async function saveUserMedicalData(userId, medicalData) {
    try {
        const objectType = 'medical-history';
        await trickleCreateObject(objectType, {
            userId,
            ...medicalData,
            timestamp: new Date().toISOString()
        });
        return true;
    } catch (error) {
        reportError(error);
        return false;
    }
}

async function getUserMedicalHistory(userId) {
    try {
        const objectType = 'medical-history';
        const history = await trickleListObjects(objectType, 100, true);
        return history.items.filter(item => item.objectData.userId === userId);
    } catch (error) {
        reportError(error);
        return [];
    }
}

async function updateUserProfile(userId, profileData) {
    try {
        const user = await trickleGetObject('users', userId);
        if (!user) {
            throw new Error('User not found');
        }

        await trickleUpdateObject('users', userId, {
            ...user.objectData,
            ...profileData,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        reportError(error);
        return false;
    }
}
