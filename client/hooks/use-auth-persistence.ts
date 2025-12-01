import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/auth/auth.slice';
import { verifyToken } from '@/store/auth/auth.thunk';
import { storage } from '@/utils/storage';

export function useAuthPersistence() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [token, user] = await Promise.all([
          storage.getToken(),
          storage.getUser(),
        ]);

        if (token && user) {
          // Set credentials from storage
          dispatch(setCredentials({ user, token }));

          // Verify token is still valid
          try {
            await dispatch(verifyToken({ token })).unwrap();
          } catch (error) {
            // Token is invalid, clear storage
            await storage.clearAuth();
            // Credentials will be cleared by the verifyToken rejected action
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        // Clear potentially corrupted data
        await storage.clearAuth();
      }
    };

    loadAuthData();
  }, [dispatch]);
}

