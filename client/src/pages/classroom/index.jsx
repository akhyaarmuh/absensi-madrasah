import Swal from 'sweetalert2';
import { ImBoxAdd } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { toRupiah } from '../../utilities';
import { Breadcrumbs, Button } from '../../components';
import { deleteClassroom } from '../../features/classroom';
import { getAllClassroom, deleteClassroomById } from '../../fetchers/classroom';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Kelas' }];

const Classroom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [classroom, setClassroom] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
    name: '',
    page: 0,
    limit: 20,
    sort: 'name',
  });
  const [getting, setGetting] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      setGetting(true);
      try {
        const data = await getAllClassroom(queries);
        setClassroom(data);
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
      title: `Hapus kelas ${deleted.name}?`,
      text: `Semua santri dengan kelas ${deleted.name} akan ikut terhapus`,
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
            await deleteClassroomById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
            console.log(error);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setClassroom({
          ...classroom,
          data: classroom.data.filter((classroom) => classroom._id !== deleted._id),
          rows: classroom.rows - 1,
        });

        dispatch(deleteClassroom(deleted._id));

        Swal.fire({
          icon: 'success',
          title: `${deleted.name} berhasil dihapus`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <Button
        label="Tambah Kelas"
        icon={<ImBoxAdd className="text-lg" />}
        size="md"
        onClick={() => navigate('/classroom/create')}
      />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr>
              <th className="py-3 pr-4" colSpan={2}>
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan nama kelas..."
                  name="name"
                  autoComplete="off"
                  autoFocus
                  onKeyUp={changeInputQueries}
                />
              </th>
            </tr>

            <tr className="border-y">
              <th className="w-[60px] whitespace-nowrap px-6 py-3 text-center">No.</th>
              <th className="w-[250px] whitespace-nowrap px-6">Nama Kelas</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>
          <tbody>
            {classroom.data.map((classroom, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={classroom._id}
              >
                <td className="whitespace-nowrap px-6 py-3 text-center">
                  {queries.page * queries.limit + (i + 1)}
                </td>
                <td className="whitespace-nowrap px-6">{classroom.name}</td>
                <td className="whitespace-nowrap px-6 text-right">
                  <Button
                    label="Ubah"
                    outline
                    onClick={() =>
                      navigate(`/classroom/${classroom._id}/update`, { state: classroom })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Hapus"
                    type="danger"
                    outline
                    onClick={() => handleDelete(classroom)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {toRupiah(classroom.rows)}</p>

      {classroom.rows > 0 && (
        <>
          <p>
            Halaman: {toRupiah(classroom.page + 1)} dari {toRupiah(classroom.allPage)}{' '}
            halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {classroom.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: classroom.page - 1 })}
              />
            )}

            {classroom.page < classroom.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: classroom.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Classroom;
