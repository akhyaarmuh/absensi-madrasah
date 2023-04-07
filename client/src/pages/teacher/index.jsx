import Swal from 'sweetalert2';
import { ImBoxAdd } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { toRupiah } from '../../utilities';
import { Breadcrumbs, Button } from '../../components';
import dummyProfile from '../../assets/images/profile.jpg';
import { getAllTeacher, deleteTeacherById } from '../../fetchers/teacher';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Mudaris' }];

const Teacher = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
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
        const data = await getAllTeacher(queries);
        setTeacher(data);
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
      title: `Hapus mudaris ${deleted.full_name}?`,
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
            await deleteTeacherById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setTeacher({
          ...teacher,
          data: teacher.data.filter((teacher) => teacher._id !== deleted._id),
          rows: teacher.rows - 1,
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
    return teacher.url;
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <Button
        label="Tambah Mudaris"
        icon={<ImBoxAdd className="text-lg" />}
        size="md"
        onClick={() => navigate('/teacher/create')}
      />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr>
              <th className="min-w-[185px] py-3 pr-4">
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan NIM..."
                  name="no_induk"
                  autoComplete="off"
                  autoFocus
                  onKeyUp={changeInputQueries}
                />
              </th>
              <th className="pr-4">
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan nama mudaris..."
                  name="full_name"
                  autoComplete="off"
                  onKeyUp={changeInputQueries}
                />
              </th>

              <th></th>
              <th></th>
              <th></th>
            </tr>

            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">NIM</th>
              <th className="whitespace-nowrap px-6">Nama Lengkap</th>
              <th className="whitespace-nowrap px-6">Nama Orangtua</th>
              <th className="whitespace-nowrap px-6">Gambar</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>

          <tbody>
            {teacher.data.map((teacher, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={teacher._id}
              >
                <td className="whitespace-nowrap px-6 py-3 text-primary">
                  <span
                    className="cursor-pointer hover:underline dark:font-bold"
                    onClick={() =>
                      navigate(`/teacher/${teacher._id}/detail`, {
                        state: { ...teacher, url: getUrl() },
                      })
                    }
                  >
                    {teacher.no_induk}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap px-6${
                    teacher.status ? '' : ' text-red-500'
                  }`}
                >
                  {teacher.full_name}
                </td>
                <td className="whitespace-nowrap px-6">{teacher.parent_name}</td>
                <td className="whitespace-nowrap px-6">
                  <img
                    className="h-6 w-6 object-cover "
                    src={teacher.image ? `${getUrl()}/${teacher.image}` : dummyProfile}
                    alt="profile"
                  />
                </td>
                <td className="whitespace-nowrap px-6 text-right">
                  <Button
                    label="Ubah"
                    outline
                    onClick={() =>
                      navigate(`/teacher/${teacher._id}/update`, {
                        state: { ...teacher, url: getUrl() },
                      })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Hapus"
                    type="danger"
                    outline
                    onClick={() => handleDelete(teacher)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {toRupiah(teacher.rows)}</p>

      {teacher.rows > 0 && (
        <>
          <p>
            Halaman: {toRupiah(teacher.page + 1)} dari {toRupiah(teacher.allPage)}{' '}
            halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {teacher.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: teacher.page - 1 })}
              />
            )}

            {teacher.page < teacher.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: teacher.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Teacher;
