const Dropdown = ({ children, id, button: Button, left }) => {
  const openDropdown = () => {
    document.querySelector(`#${id}`).classList.toggle('hidden');
  };

  return (
    <div className="relative">
      <button id={`${id}Button`} type="button" onClick={openDropdown}>
        <Button />
      </button>

      <div
        id={id}
        className={`dropdown-menu hidden z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute mt-2 ${
          left ? 'left-0' : 'right-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
