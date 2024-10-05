import { useState } from 'react';

const TestComponent = () => {
  const [error, setError] = useState(false);

  if (error) {
    throw new Error('버튼 클릭 후 에러 발생!');
  }

  return (
    <div>
      <button onClick={() => setError(true)}>에러 발생시키기</button>
    </div>
  );
};

export default TestComponent;
