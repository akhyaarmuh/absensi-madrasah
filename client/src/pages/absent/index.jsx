import Swal from 'sweetalert2';
import { ImBoxAdd } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { toRupiah, parseDate } from '../../utilities';
import { Breadcrumbs, Button } from '../../components';
import { createAbsent, getAllAbsent, deleteAbsentById } from '../../fetchers/absent';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Absen' }];

const displayDate = (date) => {
  const { dateWithZero, monthString, year } = parseDate(date);
  return `${dateWithZero} ${monthString} ${year}`;
};
const displayTime = (date) => {
  const { hourWithZero, minuteWithZero, secondWithZero } = parseDate(date);
  return `${hourWithZero}:${minuteWithZero}:${secondWithZero}`;
};

const Absent = () => {
  const navigate = useNavigate();
  const [absent, setAbsent] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
    page: 0,
    limit: 20,
    sort: '-created_at',
  });
  const [getting, setGetting] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      setGetting(true);
      try {
        const data = await getAllAbsent(queries);
        setAbsent(data);
      } catch (error) {
        console.log(error);
      }

      setGetting(false);
    };

    getAll();
  }, [queries]);

  const handleDelete = (deleted) => {
    const { dateWithZero, monthString } = parseDate(deleted.date);
    Swal.fire({
      title: `Hapus absen ${dateWithZero} ${monthString}?`,
      text: `Anda yakin?`,
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
            await deleteAbsentById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
            console.log(error);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setAbsent({
          ...absent,
          data: absent.data.filter((absent) => absent._id !== deleted._id),
          rows: absent.rows - 1,
        });

        Swal.fire({
          icon: 'success',
          title: `Absen berhasil dihapus`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleCreateAbsent = async () => {
    Swal.fire({
      title: `Apakah anda ingin membuat absen hari ini?`,
      text: `Jika benar klik Lanjutkan?`,
      icon: 'question',
      confirmButtonText: 'Lanjutkan!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return (async () => {
          try {
            const absent = await createAbsent();
            return absent;
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
            console.log(error);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setAbsent({
          ...absent,
          data: [res.value, ...absent.data],
          rows: absent.rows + 1,
        });

        Swal.fire({
          icon: 'success',
          title: `Absen berhasil dibuat`,
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
        label="Tambah Absen"
        icon={<ImBoxAdd className="text-lg" />}
        size="md"
        onClick={handleCreateAbsent}
      />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">Tanggal</th>
              <th className="whitespace-nowrap px-6 py-3">Waktu</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>
          <tbody>
            {absent.data.map((absent, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={absent._id}
              >
                <td className="whitespace-nowrap px-6 py-3">
                  {displayDate(absent.date)}
                </td>
                <td className="whitespace-nowrap px-6">{displayTime(absent.date)}</td>
                <td className="whitespace-nowrap px-6 text-right">
                  <Button
                    label="Absen Santri"
                    outline
                    onClick={() =>
                      navigate(`/absent/${absent._id}/student`, { state: absent })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Absen Mudaris"
                    outline
                    onClick={() =>
                      navigate(`/absent/${absent._id}/teacher`, { state: absent })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Detil"
                    type="success"
                    outline
                    onClick={() =>
                      navigate(`/absent/${absent._id}/detail`, { state: absent })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Hapus"
                    type="danger"
                    outline
                    onClick={() => handleDelete(absent)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {toRupiah(absent.rows)}</p>

      {absent.rows > 0 && (
        <>
          <p>
            Halaman: {toRupiah(absent.page + 1)} dari {toRupiah(absent.allPage)} halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {absent.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: absent.page - 1 })}
              />
            )}

            {absent.page < absent.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: absent.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Absent;
