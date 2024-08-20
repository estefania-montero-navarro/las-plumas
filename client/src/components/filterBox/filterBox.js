import React from "react";
import "../../components/global.css";

function FilterBox() {
 
  const changeBackgroundColor = (element) => {
    if (element.classList.contains('clicked')) {
      element.classList.remove('clicked'); // Si ya tiene la clase 'clicked', la quitamos
    } else {
      // Quita la clase 'clicked' de todos los elementos
      document.querySelectorAll('.option').forEach(item => {
        item.classList.remove('clicked');
      });
      element.classList.add('clicked'); // Agrega la clase 'clicked' al elemento que se hizo clic
    }
  };


  return (
    <div className="order-filter-div">
      <h3 className="h3-relleno-blanco">
        Filters
      </h3>
      <div className="order-div">
        <p>Order reservations by</p>
        <div className="options">
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              A - Z
            </p>
          </div>
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              Z - A
            </p>
          </div>
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              JAN - DIC
            </p>
          </div>
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              DIC - JAN
            </p>
          </div>
        </div>
      </div>
      <div className="filter-div">
        <p>Order reservations by</p>
        <div className="options">
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              Month
            </p>
          </div>
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              User
            </p>
          </div>
          <div className="option" onClick={changeBackgroundColor}>
            <p>
              Number
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBox;
