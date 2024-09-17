import { useState } from 'react';
import { Switch } from '@headlessui/react';
// import styles from './CustomSwitch.module.scss';
// import Light from '../../assets/images/스위치 라이트.svg';
// import Dark from '../../assets/images/스위치 다크.svg';
const CustomSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="h-10 w-20">
      <Switch
        checked={isEnabled}
        onChange={setIsEnabled}
      >
        <span className="block bg-white rounded shadow p-2 h-20 w-56 flex">
          <span
            className={`block h-full w-1/2 rounded transition duration-300 ease-in-out transform ${
              isEnabled ? 'bg-green-500 translate-x-full' : 'bg-red-500'
            }`}
          ></span>
        </span>
      </Switch>
    </div>
  );
};

export default CustomSwitch;
