// import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { parseDate } from '../../utilities';
import dummyProfile from '../../assets/images/profile.jpg';
import { Breadcrumbs } from '../../components';

const breadList = [
  { title: 'Beranda', href: '/' },
  { title: 'Santri', href: '/student' },
  { title: 'Detail Santri' },
];
const displayBirth = (date) => {
  if (!date) return '-';

  const { dateWithZero, monthString, year } = parseDate(date);
  return `${dateWithZero} ${monthString} ${year}`;
};

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState({ image: '' });

  useEffect(() => {
    if (!location.state) return navigate('/student');
    setStudent(location.state);
  }, [location, navigate]);

  // const updateStatus = () => {
  //   Swal.fire({
  //     title: `Ubah status santri ${student.full_name}?`,
  //     text: 'Anda yakin',
  //     icon: 'question',
  //     confirmButtonText: 'Ya, ubah!',
  //     confirmButtonColor: '#287bff',
  //     showDenyButton: true,
  //     denyButtonText: 'Batal',
  //     denyButtonColor: '#dc3545',
  //     showLoaderOnConfirm: true,
  //     allowOutsideClick: () => !Swal.isLoading(),
  //     preConfirm: () => {
  //       return (async () => {
  //         try {
  //           // await updateStatusById(student._id);
  //         } catch (error) {
  //           Swal.showValidationMessage(error.response?.data?.message || error.message);
  //         }
  //       })();
  //     },
  //   }).then((res) => {
  //     if (res.isConfirmed) {
  //       setStudent({
  //         ...student,
  //         status: student.status ? 0 : 1,
  //       });

  //       Swal.fire({
  //         icon: 'success',
  //         title: `Status berhasil diperbarui`,
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });
  //     }
  //   });
  // };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <div className="flex justify-center">
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-neutral-700 tablet:max-w-2xl tablet:flex-row">
          <img
            className="h-96 w-full self-center object-cover tablet:h-full tablet:w-48"
            src={student.image ? `${student.url}/${student.image}` : dummyProfile}
            alt=""
          />
          <div className="flex flex-1 flex-col justify-center p-6">
            <h5 className="mb-3 self-center font-['Uthmanic'] text-2xl font-medium text-neutral-800 dark:text-neutral-50">
              المصطفى الأمين
            </h5>
            <p className="flex text-base text-neutral-600 dark:text-neutral-200">
              <span className="inline-block w-[105px]">Nama</span>
              <span className="mr-2">:</span>
              <span>{student.full_name}</span>
            </p>
            <p className="flex text-base text-neutral-600 dark:text-neutral-200">
              <span className="inline-block w-[105px]">Bin/Binti</span>
              <span className="mr-2">:</span>
              <span>{student.parent_name}</span>
            </p>
            <p className="flex text-base text-neutral-600 dark:text-neutral-200">
              <span className="inline-block w-[105px]">Kelamin</span>
              <span className="mr-2">:</span>
              <span>{student.gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan'}</span>
            </p>
            <p className="flex text-base text-neutral-600 dark:text-neutral-200">
              <span className="inline-block w-[105px]">Alamat</span>
              <span className="mr-2">:</span>
              <span className="flex-1">{student.address}</span>
            </p>
            <p className="flex text-base text-neutral-600 dark:text-neutral-200">
              <span className="inline-block w-[105px]">Tanggal Lahir</span>
              <span className="mr-2">:</span>
              <span>{displayBirth(student.birth)}</span>
            </p>

            <div className="mt-3 self-center">
              <QRCode
                value={student.no_induk || 'no_set'}
                bgColor="rgba(0,0,0,0)"
                size={60}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
