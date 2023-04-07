import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Input } from '../../components';
import { parseDate } from '../../utilities';
import dummyProfile from '../../assets/images/profile.jpg';
import { createAbsentDetail, updateAbsentDetailByNoInduk } from '../../fetchers/absent';

const displayBirth = (date) => {
  if (!date) return '-';

  const { dateWithZero, monthString, year } = parseDate(date);
  return `${dateWithZero} ${monthString} ${year}`;
};

const displayTime = () => {
  const { hourWithZero, minuteWithZero, secondWithZero } = parseDate(new Date());
  return `${hourWithZero}:${minuteWithZero}:${secondWithZero}`;
};

const status = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'izin', label: 'Izin' },
  { value: 'sakit', label: 'Sakit' },
];

const Form = ({ role }) => {
  const location = useLocation();
  const [payload, setPayload] = useState({ role, status: 'hadir' });
  const [absentType, setAbsentType] = useState('datang');
  const [getting, setGetting] = useState(false);
  const [student, setStudent] = useState({});
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const runTime = () => {
      setInterval(() => {
        setTime(displayTime());
      }, 1000);
    };

    runTime();
  }, []);

  useEffect(() => {
    if (!getting) document.querySelector('input#no_induk').focus();
  }, [getting]);

  const handleAbsent = async (e) => {
    const value = e.target.value;
    let user;

    if (e.key === 'Enter') {
      setGetting(true);

      try {
        if (role === 'teacher' && absentType === 'pulang') {
          user = await updateAbsentDetailByNoInduk(location.state._id, {
            no_induk: value,
          });
        } else {
          user = await createAbsentDetail(location.state._id, {
            ...payload,
            no_induk: value,
          });
        }

        setStudent(user);

        Swal.fire({
          icon: 'success',
          title: `${user.full_name} berhasil absen`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title:
            error.response?.data?.error?.id_student ||
            error.response?.data?.error?.id_teacher ||
            error.response?.data?.message ||
            `Terjadi kesalahan`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      document.querySelector('input#no_induk').value = '';
      setGetting(false);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col gap-y-3 justify-center items-center">
      <div>
        <h1 className="text-2xl">
          Absen Hadir {role === 'student' ? 'Santri' : 'Mudaris'}
        </h1>

        <h1 className="text-2xl mb-3 text-center">{time}</h1>
      </div>

      <div className="flex items-center gap-x-2">
        {role === 'teacher' && (
          <Input
            type="select"
            options={[
              { value: 'datang', label: 'Absen Datang' },
              { value: 'pulang', label: 'Absen Pulang' },
            ]}
            defaultValue={{ value: 'datang', label: 'Absen Datang' }}
            onChange={(e) => setAbsentType(e.value)}
          />
        )}
        <Input
          type="select"
          options={status}
          defaultValue={{ value: 'hadir', label: 'Hadir' }}
          onChange={(e) => setPayload({ ...payload, status: e.value })}
        />
        <Input
          id="no_induk"
          name="no_induk"
          placeholder={role === 'student' ? 'NIS...' : 'NIM...'}
          autoComplete="off"
          onKeyUp={handleAbsent}
          disabled={getting}
        />
      </div>

      {/* card */}
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
              <span>
                {student.gender
                  ? student.gender === 'laki-laki'
                    ? 'Laki-laki'
                    : 'Perempuan'
                  : '-'}
              </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
