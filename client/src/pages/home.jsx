import { FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { ImUserTie } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { MdMeetingRoom } from 'react-icons/md';
import { FaUserGraduate } from 'react-icons/fa';

import { toRupiah } from '../utilities';
import { getAllUser } from '../fetchers/user';
import { getAllTeacher } from '../fetchers/teacher';
import { getAllStudent } from '../fetchers/student';

const Home = () => {
  const classrooms = useSelector((state) => state.classroom.data);
  const [users, setUsers] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [students, setStudents] = useState(0);

  useEffect(() => {
    const getAll = async () => {
      try {
        const { rows: users } = await getAllUser();
        const { rows: teachers } = await getAllTeacher();
        const { rows: students } = await getAllStudent();
        setUsers(users);
        setTeachers(teachers);
        setStudents(students);
      } catch (error) {
        console.log(error);
      }
    };

    getAll();
  }, []);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2">
      <Card
        title="Jumlah Kelas"
        count={toRupiah(classrooms.length)}
        icon={<MdMeetingRoom />}
      />
      <Card title="Jumlah Mudaris" count={toRupiah(teachers)} icon={<ImUserTie />} />
      <Card title="Jumlah Santri" count={toRupiah(students)} icon={<FaUserGraduate />} />
      <Card title="Jumlah Pengguna" count={toRupiah(users)} icon={<FaUsers />} />
    </div>
  );
};

export default Home;

const Card = (props) => {
  const { title, count, percentage, icon } = props;

  return (
    <div className="shadow-soft-xl relative flex justify-between rounded-2xl bg-white bg-clip-border p-4 dark:bg-gunmetal dark:text-frenchgray">
      <div className="self-center px-3">
        <p className="text-sm font-semibold leading-normal">{title}</p>
        <h5 className="font-bold">
          {count}
          <span className="font-weight-bolder text-sm leading-normal text-primary">
            {percentage}
          </span>
        </h5>
      </div>
      <div className="flex items-center px-3 py-4 text-2xl text-primary">{icon}</div>
    </div>
  );
};
