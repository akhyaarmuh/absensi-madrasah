import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Breadcrumbs, Input } from '../../components';
import { getUserAbsent } from '../../fetchers/absent';

const breadList = [
  { title: 'Beranda', href: '/' },
  { title: 'Absen', href: '/absent' },
  { title: 'Detail Absen' },
];

const Detail = () => {
  const location = useLocation();
  const id = location.state._id;
  const [data, setData] = useState([]);
  const [rows, setRows] = useState(0);
  const [queries, setQueries] = useState({ role: 'student' });

  useEffect(() => {
    const getAll = async () => {
      const res = await getUserAbsent(id, queries);
      setData(res.data);
      setRows(res.rows);
    };

    getAll();
  }, [queries, id]);

  return (
    <>
      <Breadcrumbs list={breadList} />
      <div className="w-full tablet:max-w-xs ml-auto">
        <Input
          type="select"
          defaultValue={{ value: 'student', label: 'Santri' }}
          options={[
            { value: 'student', label: 'Santri' },
            { value: 'teacher', label: 'Mudaris' },
          ]}
          onChange={(e) => setQueries({ ...queries, role: e.value })}
        />
      </div>

      <h3>Jumlah tidak hadir: {rows}</h3>

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">
                {queries.role === 'student' ? 'NIS' : 'NIM'}
              </th>
              <th className="whitespace-nowrap px-6">Nama Lengkap</th>
              <th className="whitespace-nowrap px-6">Nama Orangtua</th>
              <th className="whitespace-nowrap px-6">Alamat</th>
              {queries.role === 'student' && (
                <th className="whitespace-nowrap px-6">Kelas</th>
              )}
              <th className="whitespace-nowrap px-6">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((student, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={student._id}
              >
                <td className="whitespace-nowrap px-6 py-3">{student.no_induk}</td>
                <td className="whitespace-nowrap px-6">{student.full_name}</td>
                <td className="whitespace-nowrap px-6">{student.parent_name}</td>
                <td className="whitespace-nowrap px-6">{student.address}</td>
                {queries.role === 'student' && (
                  <td className="whitespace-nowrap px-6">{student.classroom?.name}</td>
                )}
                <td className="whitespace-nowrap px-6">
                  {!student.status[0]
                    ? 'Tidak Hadir'
                    : student.status[0] === 'pending'
                    ? 'Tidak Absen Pulang'
                    : student.status[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Detail;
