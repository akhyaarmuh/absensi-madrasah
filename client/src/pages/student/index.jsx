import Swal from 'sweetalert2';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { ImBoxAdd } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { toRupiah } from '../../utilities';
import { Breadcrumbs, Button } from '../../components';
// import dummyProfile from '../../assets/images/profile.jpg';
import { getAllStudent, deleteStudentById } from '../../fetchers/student';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Santri' }];
const status = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'berhenti', label: 'Berhenti' },
  { value: 'lulus', label: 'Lulus' },
];

const Student = () => {
  const navigate = useNavigate();
  const classrooms = useSelector((state) => state.classroom.data);
  const [student, setStudent] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
    classroom: '',
    status: 'aktif',
    full_name: '',
    no_induk: '',
    page: 0,
    limit: 20,
    sort: 'full_name',
  });
  const [getting, setGetting] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      setGetting(true);
      try {
        const data = await getAllStudent(queries);
        setStudent(data);
      } catch (error) {
        console.log(error);
      }

      setGetting(false);
    };

    getAll();
  }, [queries]);

  const changeInputQueries = (e) => {
    if (getting) return;

    const name = e.target.name;
    const value = e.target.value;

    if (e.key === 'Enter' || (value === '' && queries[name] !== ''))
      setQueries({ ...queries, [name]: value, page: 0 });
  };

  const handleDelete = (deleted) => {
    Swal.fire({
      title: `Hapus santri ${deleted.full_name}?`,
      text: 'Anda yakin',
      icon: 'question',
      confirmButtonText: 'Ya, hapus!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return (async () => {
          try {
            await deleteStudentById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setStudent({
          ...student,
          data: student.data.filter((student) => student._id !== deleted._id),
          rows: student.rows - 1,
        });

        Swal.fire({
          icon: 'success',
          title: `${deleted.full_name} berhasil dihapus`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const getUrl = () => {
    return student.url;
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <Button
        label="Tambah Santri"
        icon={<ImBoxAdd className="text-lg" />}
        size="md"
        onClick={() => navigate('/student/create')}
      />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr>
              <th className="min-w-[185px] py-3 pr-4">
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan NIS..."
                  name="no_induk"
                  autoComplete="off"
                  autoFocus
                  onKeyUp={changeInputQueries}
                />
              </th>
              <th className="pr-4">
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan nama santri..."
                  name="full_name"
                  autoComplete="off"
                  onKeyUp={changeInputQueries}
                />
              </th>

              <th></th>
              {/* <th></th> */}

              <th className="min-w-[170px] pr-4">
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  menuPosition="fixed"
                  placeholder="Semua kelas..."
                  name="classroom"
                  isClearable
                  options={classrooms}
                  onChange={(e) =>
                    setQueries({ ...queries, classroom: e?.value || '', page: 0 })
                  }
                />
              </th>
              <th className="min-w-[180px] pr-4">
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  menuPosition="fixed"
                  placeholder="Semua status..."
                  defaultValue={{ value: 'aktif', label: 'Aktif' }}
                  name="status"
                  isClearable
                  options={status}
                  onChange={(e) =>
                    setQueries({ ...queries, status: e?.value || '', page: 0 })
                  }
                />
              </th>
              <th></th>
            </tr>

            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">NIS</th>
              <th className="whitespace-nowrap px-6">Nama Lengkap</th>
              <th className="whitespace-nowrap px-6">Nama Orangtua</th>
              {/* <th className="whitespace-nowrap px-6">Gambar</th> */}
              <th className="whitespace-nowrap px-6">Kelas</th>
              <th className="whitespace-nowrap px-6">Status</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>

          <tbody>
            {student.data.map((student, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={student._id}
              >
                <td className="whitespace-nowrap px-6 py-3 text-primary">
                  <span
                    className="cursor-pointer hover:underline dark:font-bold"
                    onClick={() =>
                      navigate(`/student/${student._id}/detail`, {
                        state: { ...student, url: getUrl() },
                      })
                    }
                  >
                    {student.no_induk}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap px-6${
                    student.status ? '' : ' text-red-500'
                  }`}
                >
                  {student.full_name}
                </td>
                <td className="whitespace-nowrap px-6">{student.parent_name}</td>
                {/* <td className="whitespace-nowrap px-6">
                  <img
                    className="h-6 w-6 object-cover "
                    src={student.image ? `${getUrl()}/${student.image}` : dummyProfile}
                    alt="profile"
                  />
                </td> */}
                <td className="whitespace-nowrap px-6">{student.classroom.name}</td>
                <td className="whitespace-nowrap px-6">{student.status}</td>
                <td className="whitespace-nowrap px-6 text-right">
                  <Button
                    label="Ubah"
                    outline
                    onClick={() =>
                      navigate(`/student/${student._id}/update`, {
                        state: { ...student, url: getUrl() },
                      })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Hapus"
                    type="danger"
                    outline
                    onClick={() => handleDelete(student)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {toRupiah(student.rows)}</p>

      {student.rows > 0 && (
        <>
          <p>
            Halaman: {toRupiah(student.page + 1)} dari {toRupiah(student.allPage)}{' '}
            halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {student.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: student.page - 1 })}
              />
            )}

            {student.page < student.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: student.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Student;
