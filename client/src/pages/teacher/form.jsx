import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { parseDate } from '../../utilities';
import { Breadcrumbs, Input, Button } from '../../components';

import { createTeacher, updateTeacherById } from '../../fetchers/teacher';

const forms = [
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'NIM',
    placeholder: 'Masukan NIM...',
    name: 'no_induk',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama Lengkap',
    placeholder: 'Masukan nama mudaris...',
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
];

const Form = (props) => {
  const { type } = props;
  const breadList = [
    { title: 'Beranda', href: '/' },
    { title: 'Mudaris', href: '/teacher' },
    { title: type === 'create' ? 'Buat' : 'Perbarui' },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const [gender, setGender] = useState([]);
  const [payload, setPayload] = useState({
    no_induk: '',
    full_name: '',
    parent_name: '',
    birth: '',
    gender: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({
    no_induk: '',
    full_name: '',
    parent_name: '',
    birth: '',
    gender: '',
    address: '',
  });

  useEffect(() => {
    if (type === 'update') {
      if (!location.state) return navigate('/teacher');
      const { year, monthWithZero, dateWithZero } = parseDate(location.state.birth);
      setPayload({
        ...location.state,
        birth: `${year}-${monthWithZero}-${dateWithZero}`,
      });
      setGender({
        value: location.state.gender,
        label: location.state.gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan',
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
        await updateTeacherById(payload);
        navigate('/teacher');
      } else {
        const newTeacher = await createTeacher(payload);
        Swal.fire({
          icon: 'success',
          title: `${newTeacher.full_name} berhasil dibuat`,
          timer: 1500,
          showConfirmButton: false,
        });

        // navigate upload image
        navigate(`/teacher/${newTeacher._id}/upload-image`, {
          state: { ...newTeacher, from: 'create', model: 'Teacher' },
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
                  value={gender}
                  errorMessage={error[name]}
                  options={[
                    { value: 'laki-laki', label: 'Laki-laki' },
                    { value: 'perempuan', label: 'Perempuan' },
                  ]}
                  onChange={(e) => {
                    setGender(e);
                    setPayload({ ...payload, gender: e.value });
                    setError({ ...error, gender: '' });
                  }}
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
              navigate(`/teacher/${payload._id}/upload-image`, {
                state: { ...payload, from: 'update', model: 'Teacher' },
              })
            }
          />
        </>
      )}
    </>
  );
};

export default Form;
