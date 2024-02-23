import { useState } from 'react';
import './covalent3DScan.css';
import p5 from 'p5'; // Importa p5 como una función

const CovalentTokenViewer = () => {
  const [address, setAddress] = useState('');
  const [tokensData, setTokensData] = useState([]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(-1);

  const getData = async () => {
    try {
      const response = await fetch(
        `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?key=cqt_rQxtM4C4RhdgHfXtvVCXhRmJbm4c`
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

  const sketch = (p) => {
    let tokensDataCopy = [];

    p.setup = () => {
      p.createCanvas(800, 400, p.WEBGL);
    };

    p.draw = () => {
      p.background(0);

      p.orbitControl();

      for (let i = 0; i < Math.min(tokensDataCopy.length, 5); i++) {
        let token = tokensDataCopy[i];
        let valueInUSD = token.quote;
        let radius = p.map(valueInUSD, 0, 100, 50, 200);
        let xPos = -200 + i * 200;
        let yPos = 0;
        let zPos = 0;
        let rotationAngle = p.frameCount * 0.01;

        let sphereColor = p.color(p.random(255), p.random(255), p.random(255));

        if (token.contract_name === 'Ether') {
          sphereColor = p.color(255, 0, 255);
        } else if (token.contract_name === 'Tether USD') {
          sphereColor = p.color(0, 255, 0);
        } else if (token.contract_name === 'USD Coin') {
          sphereColor = p.color(0, 0, 255);
        } else if (token.contract_name === 'Wrapped Ether') {
          sphereColor = p.color(255, 255, 0);
        } else if (token.contract_name === 'Matic Token') {
          sphereColor = p.color(0, 255, 85);
        }

        p.fill(sphereColor);
        p.push();
        p.translate(xPos, yPos, zPos);
        p.rotateY(rotationAngle);
        p.sphere(radius);
        p.pop();

        let distance = p.dist(
          p.mouseX - p.width / 2,
          p.mouseY - p.height / 2,
          xPos,
          yPos
        );
        if (distance < radius) {
          setSelectedTokenIndex(i);
        }
      }
    };

    p.mouseClicked = () => {
      if (selectedTokenIndex !== -1) {
        let selectedToken = tokensDataCopy[selectedTokenIndex];
        alert(
          `Token Information:\nName: ${selectedToken.contract_name}\nValue: ${selectedToken.quote}`
        );
      }
    };

    p.myCustomRedrawAccordingToNewPropsHandler = (newTokensData) => {
      tokensDataCopy = newTokensData.slice();
    };
  };

  let myp5;

  const ref = (node) => {
    if (node != null) {
      myp5 = new p5(sketch, node);
    }
  };

  return (
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
      <div id="tokenText" className="token-info-container"></div>
      <div ref={ref}></div>
    </div>
  );
};

export default CovalentTokenViewer;
