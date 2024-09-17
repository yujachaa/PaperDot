import { useState } from 'react';
import { Switch } from '@headlessui/react';
import Light from '../../assets/images/스위치 라이트.svg';
import Dark from '../../assets/images/스위치 다크.svg';

const CustomSwitch = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`group relative flex items-center justify-between h-10 w-20 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-dark-toggle-background' : 'bg-light-toggle-background'
      }
      mobile:h-8 mobile:w-14
      `}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-8 w-8 rounded-full bg-cover transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-10' : 'translate-x-0'
        } mobile:h-6 mobile:w-6 ${enabled ? 'mobile:translate-x-6' : 'mobile:translate-x-0'}`}
        style={{
          backgroundImage: `url(${enabled ? Dark : Light})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </Switch>
  );
};

export default CustomSwitch;
