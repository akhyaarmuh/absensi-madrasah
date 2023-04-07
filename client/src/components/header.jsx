import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMenuOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import Dropdown from './dropdown';
import { logout } from '../fetchers/auth';

import profileImage from '../assets/images/profile.png';

import { toggleSidenav } from '../features/theme';
import { logout as logoutCLient } from '../features/user';

const Header = () => {
  const dispatch = useDispatch();
  const full_name = useSelector((state) => state.user.full_name);
  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    window.onscroll = () => {
      const header = document.querySelector('header');
      if (header) {
        const offsetTop = header.offsetTop;
        if (offsetTop > 0) {
          header.classList.add(
            'shadow-[0_-1px_0_0_#d1d5db_inset]',
            'dark:shadow-[0_-1px_0_0_#374151_inset]'
          );
        } else {
          header.classList.remove(
            'shadow-[0_-1px_0_0_#d1d5db_inset]',
            'dark:shadow-[0_-1px_0_0_#374151_inset]'
          );
        }
      }
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Anda yakin ingin keluar?',
      icon: 'question',
      confirmButtonText: 'Ya, keluar!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return (async () => {
          try {
            await logout();
            dispatch(logoutCLient());
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 text-stategray backdrop-blur-[5px] dark:text-white">
      <button
        className="text-2xl hover:opacity-75"
        onClick={() => dispatch(toggleSidenav())}
      >
        <IoMenuOutline />
      </button>
      <div className="flex items-center gap-2">
        <h5 className="hidden max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap tablet:inline-block ">
          {full_name}
        </h5>
        <Dropdown id="dropdownHeader" button={Profile}>
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className="tablet:hidden">{full_name}</div>
            <div className="font-medium truncate">{email}</div>
          </div>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <Link
                to="/user-setting"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Pengaturan
              </Link>
            </li>
          </ul>
          <div className="py-2">
            <button
              onClick={handleLogout}
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Keluar
            </button>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;

const Profile = () => {
  return (
    <div className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full">
      <img src={profileImage} alt="profile" className="w-full" />
    </div>
  );
};
