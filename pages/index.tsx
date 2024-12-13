import React from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/todo');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Next.js App</h1>
      <p>This is the home page of your Next.js application.</p>
      <button
        onClick={handleButtonClick}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Go to Todo
      </button>
    </div>
  );
};

export default Home;
