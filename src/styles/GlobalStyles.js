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
    margin-top: 80px !important;
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
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-top: 5px;
    text-align: center;
    border-radius: 15px;
    color: white;
    font-weight: bold;
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
