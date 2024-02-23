import { useState } from 'react';
import './covalent3DScan.css';

function Covalent3DScan() {
  const [tokensData, setTokensData] = useState([]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(-1);
  const [address, setAddress] = useState('');

  async function getData() {
    const resp = await fetch(
      `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?key=${
        import.meta.env.VITE_COVALENT_API_KEY
      }`
    );
    const json = await resp.json();
    setTokensData(json.data.items);
  }

  function handleGetData() {
    getData();
  }

  function handleTokenSelection(index) {
    setSelectedTokenIndex(index);
  }

  return (
    <div className="container">
      <h1 className="title">Covalent3DScan</h1>
      <div className="input-container">
        <label htmlFor="addressInput"> Address:</label>
        <input
          type="text"
          id="addressInput"
          placeholder="Dirección de Ethereum"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button id="getDataButton" onClick={handleGetData}>
          Get Tokens and View in 3D
        </button>
      </div>
      <div className="token-container">
        {tokensData.map((token, index) => (
          <div
            key={index}
            className="token-info"
            onClick={() => handleTokenSelection(index)}
          >
            <h2>{token.contract_name}</h2>
            <h2>{token.quote}</h2>
          </div>
        ))}
      </div>
      {selectedTokenIndex !== -1 && (
        <div className="token-info-container">
          <div className="token-info">
            <h2>{tokensData[selectedTokenIndex].contract_name}</h2>
            <h2>{tokensData[selectedTokenIndex].quote}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Covalent3DScan;
