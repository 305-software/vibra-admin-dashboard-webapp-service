/**
 * The Setting component is responsible for rendering the settings page.
 * It includes a header (`SettingHead`) and the main settings content (`Setting`).
 * 
 * This component uses a loading state to simulate data fetching, displaying a `Spinner`
 * until the simulated data load is complete.
 * 
 * @component
 * @returns {JSX.Element} The rendered settings page component.
 */

import React , { useEffect,useState } from 'react';

import  Setting from "../components/setting/setting";
import SettingHead from "../components/setting/settingHead";
import Spinner from "../utlis/spinner"

function setting() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Simulate data fetching
      setTimeout(() => {
          setLoading(false);
      }, 1000);
  }, []);

  if (loading) {
      return <Spinner />;
  }
  return (
    <div>
      <SettingHead/>
      <Setting />
    </div>
  )
}

export default setting
