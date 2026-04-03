import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { setLoggedInUser } from '../user/loggedInUserSlice';
import { backendUrl } from '../build/backendUrl';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${backendUrl}/api/clarion/system/user/me`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (response.status === 401) {
          navigate('/login');
          return null;
        }
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data?.user) {
          dispatch(
            setLoggedInUser({
              id: data.user.id ?? '',
              name: data.user.name ?? '',
              email: data.user.email ?? '',
            })
          );
        }
      })
      .catch(() => {
        // Network error: leave auth state empty, let UI handle gracefully
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
