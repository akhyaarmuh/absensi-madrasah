import { Dashboard, PrivateRoute } from './components';
import {
  Absent,
  Classroom,
  ForgotPassword,
  Home,
  Login,
  Register,
  Restore,
  Student,
  Teacher,
  User,
  UserSetting,
} from './pages';

const routes = [
  {
    path: '/',
    element: (
      <Dashboard active="home">
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      </Dashboard>
    ),
  },

  {
    path: '/absent',
    element: (
      <Dashboard active="absent">
        <PrivateRoute>
          <Absent.List />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/absent/:id/detail',
    element: (
      <Dashboard active="absent">
        <PrivateRoute>
          <Absent.Detail />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/absent/:id/student',
    element: (
      <PrivateRoute>
        <Absent.Form role="student" />
      </PrivateRoute>
    ),
  },
  {
    path: '/absent/:id/teacher',
    element: (
      <PrivateRoute>
        <Absent.Form role="teacher" />
      </PrivateRoute>
    ),
  },

  {
    path: '/classroom',
    element: (
      <Dashboard active="classroom">
        <PrivateRoute>
          <Classroom.List />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/classroom/create',
    element: (
      <Dashboard active="classroom">
        <PrivateRoute>
          <Classroom.Form type="create" />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/classroom/:id/update',
    element: (
      <Dashboard active="classroom">
        <PrivateRoute>
          <Classroom.Form type="update" />
        </PrivateRoute>
      </Dashboard>
    ),
  },

  {
    path: '/teacher',
    element: (
      <Dashboard active="teacher">
        <PrivateRoute>
          <Teacher.List />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/teacher/create',
    element: (
      <Dashboard active="teacher">
        <PrivateRoute>
          <Teacher.Form type="create" />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/teacher/:id/upload-image',
    element: (
      <Dashboard active="teacher">
        <PrivateRoute>
          <Teacher.UploadImage />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/teacher/:id/update',
    element: (
      <Dashboard active="teacher">
        <PrivateRoute>
          <Teacher.Form type="update" />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/teacher/:id/detail',
    element: (
      <Dashboard active="teacher">
        <PrivateRoute>
          <Teacher.Detail />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  // akhir teacher

  // awal student
  {
    path: '/student',
    element: (
      <Dashboard active="student">
        <PrivateRoute>
          <Student.List />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/student/create',
    element: (
      <Dashboard active="student">
        <PrivateRoute>
          <Student.Form type="create" />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/student/:id/upload-image',
    element: (
      <Dashboard active="student">
        <PrivateRoute>
          <Student.UploadImage />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/student/:id/update',
    element: (
      <Dashboard active="student">
        <PrivateRoute>
          <Student.Form type="update" />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/student/:id/detail',
    element: (
      <Dashboard active="student">
        <PrivateRoute>
          <Student.Detail />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  // akhir student

  {
    path: '/user',
    element: (
      <Dashboard active="user">
        <PrivateRoute>
          <User />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/user-setting',
    element: (
      <Dashboard active="user-setting">
        <PrivateRoute>
          <UserSetting />
        </PrivateRoute>
      </Dashboard>
    ),
  },
  {
    path: '/restore',
    element: (
      <Dashboard active="restore">
        <PrivateRoute>
          <Restore />
        </PrivateRoute>
      </Dashboard>
    ),
  },

  // auth page
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
];
export default routes;
