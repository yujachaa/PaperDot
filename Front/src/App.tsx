import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="text-lime-500">테일윈드 테스트</div>
      <Outlet />
    </>
  );
}

export default App;
