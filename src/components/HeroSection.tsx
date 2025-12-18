import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="row pt-5 pb-5 bg-light-blue">
      <div className="col-10 offset-1 row">
        <div className="offset-1 col-3 mt-5">
          <div className="row">
            <h1>Nadpis nějakej velvo #FREESOCHOR</h1>
          </div>
          <div className="row col-12">
            <p className="col-12">
              We are Charlie Kirk, we carry the flame We'll fight for the
              Gospel, we'll honor his name We are Charlie Kirk, his courage our
              own Together unbroken, we'll make Heaven known A husband, a
              father, his family held near A home built on Scripture, on faith
              without fear The world tried to silence, but his voice remains In
              us it echoes, in Christ it sustains
            </p>
          </div>
          <div className="row mt-5 col-12">
            <div className="col-2">
              <button type="button" className="btn btn-primary btn-lg">
                Primary
              </button>
            </div>
            <div className="col-2 offset-2">
              <button type="button" className="btn btn-primary btn-lg">
                Primary
              </button>
            </div>
            <div className="col-2 offset-2">
              <button type="button" className="btn btn-primary btn-lg">
                Primary
              </button>
            </div>
          </div>
        </div>
        <div className="col-6 offset-2 mt-5">
          <img
            className="img-fluid"
            src="https://d8-a.sdn.cz/d_8/c_imgrestricted_od_A/nO2tpF5hUICLbyDwFET256W/c727/charlie-kirk.jpeg?fl=cro,0,532,2453,1379%7Cres,1200,,1"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
