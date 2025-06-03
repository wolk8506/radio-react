import error404 from '../images/NotFoundPage.png';

export const NotFoundPage = () => {
  return (
    <section className="container-404">
      <div className="block-img">
        <img src={error404} alt="" width={600} />
        <div className="block-title">
          <p className="title-404">404</p>
          <p className="title-text">страница не нейдена</p>
        </div>
      </div>
    </section>
  );
};
