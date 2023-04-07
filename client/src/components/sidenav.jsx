import { Link } from 'react-router-dom';
import { ImBooks } from 'react-icons/im';
import { IoMdClose } from 'react-icons/io';
import { ImUserTie } from 'react-icons/im';
import { CgUserlane } from 'react-icons/cg';
import { GoDatabase } from 'react-icons/go';
import { MdMeetingRoom } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { FaMosque, FaUserEdit, FaUserGraduate } from 'react-icons/fa';

import { toggleSidenav } from '../features/theme';

const dataSidenav = [
  {
    type: 'navigation',
    title: 'Beranda',
    to: '/',
    icon: <FaMosque />,
    page: 'home',
  },

  {
    type: 'title',
    title: 'Absensi',
  },
  {
    type: 'navigation',
    title: 'Absen',
    to: '/absent',
    icon: <ImBooks />,
    page: 'absent',
  },

  {
    type: 'title',
    title: 'Data Master',
  },
  {
    type: 'navigation',
    title: 'Kelas',
    to: '/classroom',
    icon: <MdMeetingRoom />,
    page: 'classroom',
  },
  {
    type: 'navigation',
    title: 'Mudaris',
    to: '/teacher',
    icon: <ImUserTie />,
    page: 'teacher',
  },
  {
    type: 'navigation',
    title: 'Santri',
    to: '/student',
    icon: <FaUserGraduate />,
    page: 'student',
  },
  {
    type: 'navigation',
    title: 'Pengguna',
    to: '/user',
    icon: <CgUserlane />,
    page: 'user',
  },

  {
    type: 'title',
    title: 'Pengaturan',
  },
  {
    type: 'navigation',
    title: 'User',
    to: '/user-setting',
    icon: <FaUserEdit />,
    page: 'user-setting',
  },
  {
    type: 'navigation',
    title: 'Pulihkan',
    to: '/restore',
    icon: <GoDatabase />,
    page: 'restore',
  },
];

const Sidenav = ({ active }) => {
  const dispatch = useDispatch();
  const sidenav = useSelector((state) => state.theme.openSidenav);

  return (
    <aside
      className={`${
        sidenav
          ? 'w-full border-l-[10px] laptop:w-[300px]'
          : 'w-0 laptop:w-[80px] laptop:border-l-[10px]'
      } fixed top-0 bottom-0 z-20 overflow-x-hidden border-primary bg-primary text-white transition-all duration-500 dark:border-gunmetal dark:bg-gunmetal`}
    >
      {/* brand */}
      <div className="flex h-[60px] items-center">
        <span className="inline-flex w-[60px] flex-none justify-center py-3 text-4xl">
          <FaMosque />
          {/* <img src={img_src} alt="logo" className="w-full" /> */}
        </span>
        <h1 className="flex-1 whitespace-nowrap pl-[10px] font-['Uthmanic'] text-3xl">
          {process.env.REACT_APP_NAME}
        </h1>
        <button
          className="mr-[20px] text-2xl font-bold tablet:mr-4 laptop:hidden"
          onClick={() => dispatch(toggleSidenav())}
        >
          <IoMdClose />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5">
        <ul>
          {dataSidenav.map((nav, i) => {
            if (nav.type === 'title')
              return <Navtitle title={nav.title} sidenav={sidenav} key={i} />;

            return (
              <Navlink
                title={nav.title}
                to={nav.to}
                icon={nav.icon}
                active={active === nav.page ? true : false}
                key={i}
              />
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidenav;

const Navlink = (props) => {
  const { icon, to, title, active } = props;

  return (
    <Link to={to}>
      <li
        className={`${
          active
            ? "pointer-events-none rounded-l-[30px] bg-seasalt text-primary before:absolute before:right-0 before:-top-[50px] before:h-[50px] before:w-[50px] before:rounded-full before:bg-transparent before:shadow-[35px_35px_0_10px] before:shadow-seasalt before:content-[''] after:absolute after:right-0 after:-bottom-[50px] after:h-[50px] after:w-[50px] after:rounded-full after:bg-transparent after:shadow-[35px_-35px_0_10px] after:shadow-seasalt after:content-[''] dark:bg-richblack dark:before:shadow-richblack dark:after:shadow-richblack "
            : 'z-10 '
        }relative flex h-[50px] items-center transition-all duration-100 hover:ml-[10px]`}
      >
        <span className="inline-flex w-[60px] flex-none justify-center text-xl">
          {icon}
        </span>
        <p className="flex h-full flex-1 items-center whitespace-nowrap px-[10px] text-lg font-light">
          {title}
        </p>
      </li>
    </Link>
  );
};

const Navtitle = ({ title, sidenav }) => {
  return (
    <h3
      className={`${
        sidenav ? 'block ' : 'hidden '
      }mb-2 mt-4 whitespace-nowrap pl-[10px] text-sm`}
    >
      {title}
    </h3>
  );
};
