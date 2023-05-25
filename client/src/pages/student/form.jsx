import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { parseDate } from '../../utilities';
import { Breadcrumbs, Input, Button } from '../../components';

import { createStudent, updateStudentById } from '../../fetchers/student';

const status = [
  { value: 'aktif', label: 'aktif' },
  { value: 'berhenti', label: 'berhenti' },
  { value: 'lulus', label: 'lulus' },
];

const forms = [
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'NIS',
    placeholder: 'Masukan NIS...',
    name: 'no_induk',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama Lengkap',
    placeholder: 'Masukan nama santri...',
    name: 'full_name',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama Orangtua',
    placeholder: 'Masukan nama orangtua...',
    name: 'parent_name',
  },
  {
    type: 'date',
    required: true,
    autoComplete: 'off',
    label: 'Tanggal Lahir',
    placeholder: 'Masukan tanggal lahir...',
    name: 'birth',
  },
  {
    type: 'select',
    required: true,
    label: 'Jenis Kelamin',
    placeholder: 'Masukan jenis kelamin...',
    name: 'gender',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Alamat Lengkap',
    placeholder: 'Masukan alamat...',
    name: 'address',
  },
  {
    type: 'select',
    required: true,
    autoComplete: 'off',
    label: 'Kelas',
    placeholder: 'Masukan kelas...',
    name: 'classroom',
  },
];

const Form = (props) => {
  const { type } = props;
  const breadList = [
    { title: 'Beranda', href: '/' },
    { title: 'Santri', href: '/student' },
    { title: type === 'create' ? 'Buat' : 'Perbarui' },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const classrooms = useSelector((state) => state.classroom.data);
  const [gender, setGender] = useState([]);
  const [classroom, setClassroom] = useState([]);
  const [defaultStatus, setDefaultStatus] = useState([]);
  const [payload, setPayload] = useState({
    no_induk: '',
    full_name: '',
    parent_name: '',
    birth: '',
    gender: '',
    address: '',
    classroom: '',
    status: 'aktif',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({
    no_induk: '',
    full_name: '',
    parent_name: '',
    birth: '',
    gender: '',
    address: '',
    classroom: '',
    status: '',
  });

  useEffect(() => {
    if (type === 'update') {
      if (!location.state) return navigate('/student');
      const { year, monthWithZero, dateWithZero } = parseDate(location.state.birth);
      setPayload({
        ...location.state,
        classroom: location.state.classroom._id,
        birth: `${year}-${monthWithZero}-${dateWithZero}`,
      });
      setGender({
        value: location.state.gender,
        label: location.state.gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan',
      });
      setClassroom({
        value: location.state.classroom._id,
        label: location.state.classroom.name,
      });
      setDefaultStatus({
        value: location.state.status,
        label: location.state.status,
      });
    }
  }, [type, location, navigate]);

  useEffect(() => {
    if (!saving) document.querySelector('input[name="no_induk"]').focus();
  }, [saving]);

  const handleChangeInput = (e) => {
    const key = e.target.name;
    setPayload({ ...payload, [key]: e.target.value });
    setError({ ...error, [key]: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (type === 'update') {
        await updateStudentById(payload);
        navigate(-1);
      } else {
        const newStudent = await createStudent(payload);
        Swal.fire({
          icon: 'success',
          title: `${newStudent.full_name} berhasil dibuat`,
          timer: 1500,
          showConfirmButton: false,
        });

        // navigate upload image
        navigate(`/student/${newStudent._id}/upload-image`, {
          state: { ...newStudent, from: 'create', model: 'Student' },
        });
      }
    } catch (error) {
      if (error.response.status === 400)
        setError({ ...error, ...error.response.data.error });
      else console.log(error);
    }

    setSaving(false);
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <form onSubmit={handleSave}>
        <div className="grid gap-5 tablet:grid-cols-2">
          {forms.map(({ name, ...props }, i) => {
            if (props.type === 'select')
              return (
                <Input
                  key={i}
                  {...props}
                  disabled={saving}
                  name={name}
                  value={name === 'gender' ? gender : classroom}
                  errorMessage={error[name]}
                  options={
                    name === 'gender'
                      ? [
                          { value: 'laki-laki', label: 'Laki-laki' },
                          { value: 'perempuan', label: 'Perempuan' },
                        ]
                      : classrooms
                  }
                  onChange={
                    name === 'gender'
                      ? (e) => {
                          setGender(e);
                          setPayload({ ...payload, gender: e.value });
                          setError({ ...error, gender: '' });
                        }
                      : (e) => {
                          setClassroom(e);
                          setPayload({ ...payload, classroom: e.value });
                          setError({ ...error, classroom: '' });
                        }
                  }
                />
              );
            return (
              <Input
                key={i}
                {...props}
                preventEnter
                disabled={saving}
                name={name}
                value={payload[name]}
                errorMessage={error[name]}
                onChange={handleChangeInput}
              />
            );
          })}

          {type === 'update' && (
            <Input
              type="select"
              label="Status"
              placeholder="Status saat ini"
              disabled={saving}
              name="status"
              value={defaultStatus}
              errorMessage={error.status}
              options={status}
              onChange={(e) => {
                setDefaultStatus(e);
                setPayload({ ...payload, status: e.value });
                setError({ ...error, status: '' });
              }}
            />
          )}
        </div>
        <div className="h-5"></div>
        <Button
          block
          size="md"
          disabled={saving}
          label={type === 'create' ? 'Simpan' : 'Perbarui'}
        />
      </form>

      {type === 'update' && (
        <>
          <div className="h-2"></div>
          <Button
            block
            size="md"
            type="success"
            disabled={saving}
            label="Upload Gambar"
            onClick={() =>
              navigate(`/student/${payload._id}/upload-image`, {
                state: { ...payload, from: 'update', model: 'Student' },
              })
            }
          />
        </>
      )}
    </>
  );
};

export default Form;
