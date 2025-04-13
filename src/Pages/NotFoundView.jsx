// import error404 from '../images/error404.svg';
import error404 from '../images/404.jpg';

export const NotFoundView = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // fontSize: 40,
        // color: 'red',
      }}
    >
      <img
        src={error404}
        alt=""
        style={{
          borderRadius: '15px',
        }}
      />
      {/* 404 Страница не найдена */}
    </div>
  );
};
