import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import './covalent3DScan.css';
import MATIVIDEO from '../components/2_2.mp4';

const CovalentTokenViewer = () => {
  const [address, setAddress] = useState('');
  const [tokensData, setTokensData] = useState([]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(-1);

  const canvasRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 400, p.WEBGL).parent('tokenText');
      };

      p.draw = () => {
        p.background(255, 0); // Fondo transparente

        p.orbitControl();
        // Dibujar esferas para representar los tokens
        for (let i = 0; i < Math.min(tokensData.length, 5); i++) {
          const token = tokensData[i];
          const valueInUSD = token.quote;
          const radius = p.map(valueInUSD, 0, 100, 50, 200);
          const xPos = -200 + i * 200;
          const yPos = 0;
          const zPos = 0;
          const rotationAngle = p.frameCount * 0.01;
          const sphereColor = getColorByToken(token.contract_name, p);
          p.fill(sphereColor);
          p.push();
          p.translate(xPos, yPos, zPos);
          p.rotateY(rotationAngle);
          p.sphere(radius);
          p.pop();
        }
      };

      const getColorByToken = (tokenName, p) => {
        switch (tokenName) {
          case 'Ether':
            return p.color(255, 0, 255);
          case 'Tether USD':
            return p.color(0, 255, 0);
          case 'USD Coin':
            return p.color(0, 0, 255);
          case 'Wrapped Ether':
            return p.color(255, 255, 0);
          case 'Matic Token':
            return p.color(0, 255, 85);
          default:
            return p.color(p.random(255), p.random(255), p.random(255));
        }
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current);

    return () => {
      p5Instance.remove();
    };
  }, [tokensData]);

  const getData = async () => {
    try {
      const response = await fetch(
        `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?key=${
          import.meta.env.VITE_COVALENT_API_KEY
        }`
      );
      const json = await response.json();
      setTokensData(json.data.items);
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  const handleGetTokens = () => {
    getData();
  };

  const handleTokenClick = (index) => {
    setSelectedTokenIndex(index);
  };

  return (
    <>
      <video autoPlay loop muted className="video-background">
        <source src={MATIVIDEO} type="video/mp4" />
      </video>
      <div className="covalent-token-viewer">
        <h1 className="title">Covalent3DScan</h1>
        <div className="input-container">
          <label htmlFor="addressInput"> Address:</label>
          <input
            type="text"
            id="addressInput"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ethereum Address"
          />
          <button onClick={handleGetTokens}>Get Tokens and View in 3D</button>
        </div>
      </div>
      <div
        id="tokenText"
        className="token-info-container"
        ref={canvasRef}
      ></div>
      <div className="token-container">
        {tokensData.map((token, index) => (
          <div
            key={index}
            className={`token ${
              selectedTokenIndex === index ? 'selected' : ''
            }`}
            onClick={() => handleTokenClick(index)}
          >
            <h2>{token.contract_name}</h2>
            <h2>{token.quote}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default CovalentTokenViewer;
