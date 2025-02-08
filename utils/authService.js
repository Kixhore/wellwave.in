async function handleLogin(email, password) {
    try {
        // List users and find by email
        const userList = await trickleListObjects('users', 100, true);
        const user = userList.items.find(u => u.objectData.email === email);
        
        if (!user || !user.objectData) {
            return { success: false, error: 'User not found' };
        }

        if (user.objectData.password !== password) {
            return { success: false, error: 'Invalid password' };
        }

        // Create a new session
        const session = await trickleCreateObject('sessions', {
            userId: user.objectId,
            email: user.objectData.email,
            name: user.objectData.name,
            loginTime: new Date().toISOString(),
            active: true
        });

        if (!session) {
            return { success: false, error: 'Failed to create session' };
        }

        // Store session info in localStorage
        localStorage.setItem('session', JSON.stringify(session));
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        reportError(error);
        return { success: false, error: error.message };
    }
}

async function handleSignUp(name, email, password) {
    try {
        if (!name || !email || !password) {
            return { success: false, error: 'Missing required fields' };
        }

        // List users and check if email exists
        const userList = await trickleListObjects('users', 100, true);
        const existingUser = userList.items.find(u => u.objectData.email === email);
        
        if (existingUser) {
            return { success: false, error: 'Email already registered' };
        }

        // Create new user
        const user = await trickleCreateObject('users', {
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });

        if (!user || !user.objectData) {
            return { success: false, error: 'Failed to create user' };
        }

        // Create initial session
        const session = await trickleCreateObject('sessions', {
            userId: user.objectId,
            email: user.objectData.email,
            name: user.objectData.name,
            loginTime: new Date().toISOString(),
            active: true
        });

        if (!session) {
            return { success: false, error: 'Failed to create session' };
        }

        // Store session info
        localStorage.setItem('session', JSON.stringify(session));
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        reportError(error);
        return { success: false, error: error.message };
    }
}

async function performLogout() {
    try {
        // Get current session
        const sessionData = localStorage.getItem('session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session && session.objectId) {
                // Update session status in database
                await trickleUpdateObject('sessions', session.objectId, {
                    ...session.objectData,
                    active: false,
                    logoutTime: new Date().toISOString()
                });
            }
        }

        // Clear all user-related data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        localStorage.removeItem('chat-history');
        localStorage.removeItem('user-preferences');
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toISOString() + ";path=/");
        });
        
        return { success: true };
    } catch (error) {
        reportError(error);
        return { success: false, error: error.message };
    }
}

async function checkSession() {
    try {
        const sessionData = localStorage.getItem('session');
        if (!sessionData) return { valid: false };

        const session = JSON.parse(sessionData);
        if (!session || !session.objectId) return { valid: false };

        const currentSession = await trickleGetObject('sessions', session.objectId);
        if (!currentSession || !currentSession.objectData || !currentSession.objectData.active) {
            await performLogout();
            return { valid: false };
        }

        return { valid: true, session: currentSession };
    } catch (error) {
        reportError(error);
        return { valid: false, error: error.message };
    }
}

function isAuthenticated() {
    try {
        const session = localStorage.getItem('session');
        const user = localStorage.getItem('user');
        return !!(session && user);
    } catch (error) {
        reportError(error);
        return false;
    }
}
