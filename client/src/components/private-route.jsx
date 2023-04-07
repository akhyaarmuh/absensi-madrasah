/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import FixedLoading from './fixed-loading';

import { login } from '../features/user';
import { toggleSidenav } from '../features/theme';
import { setClassroom } from '../features/classroom';

import { axiosWT } from '../fetchers';
import { refreshToken } from '../fetchers/auth';
import { getAllClassroom } from '../fetchers/classroom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.full_name);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.innerWidth >= 1024) {
        dispatch(toggleSidenav(true));
      }
      if (!user) {
        try {
          const accessToken = await refreshToken();
          const decoded = jwt_decode(accessToken);
          axiosWT.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const { data } = await getAllClassroom({ sort: 'name' });
          dispatch(
            setClassroom(
              data.map((classroom) => ({ value: classroom._id, label: classroom.name }))
            )
          );
          dispatch(login(decoded));
          // dispatch(login({full_name: 'Muhammad Akhyar'}));
        } catch (error) {
          console.log(error);
          navigate('/login', { replace: true, state: { form: location } });
        }
      }
    };

    checkAuth();
  }, [user]);

  if (!user) return <FixedLoading />;

  return children;
};

export default PrivateRoute;
