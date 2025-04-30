import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    color: #333;
  }

  .leaflet-container {
    width: 100%;
    height: 100%;
  }

  /* Riposiziona i controlli zoom sotto la barra sfumata */
  .leaflet-control-zoom {
    margin-top: 90px !important;
    margin-bottom: 90px !important; // Aggiungi questa riga per allontanarlo dal banner
  }

  .marker-cluster-small {
    background-color: rgba(243, 156, 18, 0.6);
  }
  .marker-cluster-small div {
    background-color: rgba(243, 156, 18, 0.8);
  }

  .marker-cluster-medium {
    background-color: rgba(243, 156, 18, 0.6);
  }
  .marker-cluster-medium div {
    background-color: rgba(243, 156, 18, 0.8);
  }

  .marker-cluster-large {
    background-color: rgba(243, 156, 18, 0.6);
  }
  .marker-cluster-large div {
    background-color: rgba(243, 156, 18, 0.8);
  }

  .marker-cluster {
    background-clip: padding-box;
    border-radius: 20px;
  }

  .marker-cluster div {
    width: 36px;
    height: 36px;
    margin-left: 2px;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    color: white;
  }

  .custom-cluster-small {
    background-color: rgba(243, 156, 18, 0.6);
  }
  .custom-cluster-small div {
    background-color: rgba(243, 156, 18, 0.8);
  }

  .custom-cluster-medium {
    background-color: rgba(241, 128, 23, 0.6);
  }
  .custom-cluster-medium div {
    background-color: rgba(241, 128, 23, 0.8);
  }

  .custom-cluster-large {
    background-color: rgba(240, 100, 28, 0.6);
  }
  .custom-cluster-large div {
    background-color: rgba(240, 100, 28, 0.8);
  }

  .marker-cluster span {
    line-height: 30px;
  }
  
  /* Stili per il popup di Leaflet */
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
    padding: 5px;
  }
  
  .leaflet-popup-content {
    margin: 10px;
    min-width: 200px;
  }
  
  .leaflet-popup-content h3 {
    margin-bottom: 8px;
    color: #f39c12;
  }

`;

export default GlobalStyles;
