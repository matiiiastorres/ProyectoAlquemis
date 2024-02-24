import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import './covalent3DScan.css';
import MATIVIDEO from '../components/2_2.mp4';

const CovalentTokenViewer = () => {
  const [address, setAddress] = useState('');
  const [tokensData, setTokensData] = useState([]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(-1);
  const [clicked, setClicked] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const canvasWidth =
          window.innerWidth > 1100 ? 1100 : window.innerWidth - 20;
        const canvasHeight =
          window.innerWidth > 1100
            ? 600
            : (window.innerWidth - 20) * (600 / 1100); // Manteniendo la proporción

        p.createCanvas(canvasWidth, canvasHeight, p.WEBGL).parent('tokenText');
      };

      p.draw = () => {
        p.background(255, 0); // Fondo transparente
        p.orbitControl();

        for (let i = 0; i < Math.min(tokensData.length, 5); i++) {
          const token = tokensData[i];
          const valueInUSD = token.quote;
          const radius = p.map(valueInUSD, 0, 100, 50, 200);
          const xPos = -200 + i * 200;
          const yPos = 0;
          const zPos = 0;
          const rotationAngle = p.frameCount * 0.01;
          const sphereColor = getColorByToken(token.contract_name);
          p.fill(sphereColor);
          p.push();
          p.translate(xPos, yPos, zPos);
          p.rotateY(rotationAngle);
          p.sphere(radius);
          p.pop();

          // Verificar clic en la esfera actual
          const mousePos = p.createVector(
            p.mouseX - p.width / 2,
            p.mouseY - p.height / 2
          );
          const spherePos = p.createVector(xPos, yPos, zPos);
          const distance = mousePos.dist(spherePos);
          if (distance < radius && p.mouseIsPressed) {
            // Verificar si se ha hecho clic
            handleSphereClick(token); // Llamar a la función para manejar el clic en la esfera
          }
        }
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current);

    return () => {
      p5Instance.remove();
    };
  }, [tokensData]);

  const getColorByToken = (tokenName) => {
    switch (tokenName) {
      case 'Ether':
        return [255, 0, 255];
      case 'Tether USD':
        return [0, 255, 0];
      case 'USD Coin':
        return [0, 0, 255];
      case 'Wrapped Ether':
        return [255, 255, 0];
      case 'Matic Token':
        return [0, 255, 85];
      default:
        return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
    }
  };

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

  const handleSphereClick = (token) => {
    if (!clicked) {
      setClicked(true);
      alert(
        `Información del Token:\nNombre: ${token.contract_name}\nValor: ${token.quote}`
      );
    }
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
            onClick={() => setSelectedTokenIndex(index)}
            style={{
              backgroundColor: `rgb(${getColorByToken(token.contract_name).join(
                ','
              )})`,
            }}
          >
            <h2>{token.contract_name}</h2>
            <h2>{token.quote}</h2>
            <img
              src={token.logo_url}
              alt="Token Logo"
              className="token-logo"
              style={{ width: '64px', height: '64px' }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CovalentTokenViewer;
// export default CovalentTokenViewer;
// import { useEffect, useRef, useState } from 'react';
// import p5 from 'p5';
// import './covalent3DScan.css';
// import MATIVIDEO from '../components/2_2.mp4';

// const CovalentTokenViewer = () => {
//   const [address, setAddress] = useState('');
//   const [tokensData, setTokensData] = useState([]);
//   const [selectedTokenIndex, setSelectedTokenIndex] = useState(-1);

//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const sketch = (p) => {
//       p.setup = () => {
//         const canvasWidth =
//           window.innerWidth > 1100 ? 1100 : window.innerWidth - 20;
//         const canvasHeight =
//           window.innerWidth > 1100
//             ? 600
//             : (window.innerWidth - 20) * (600 / 1100); // Manteniendo la proporción

//         p.createCanvas(canvasWidth, canvasHeight, p.WEBGL).parent('tokenText');
//       };

//       p.draw = () => {
//         p.background(255, 0); // Fondo transparente
//         p.orbitControl();

//         for (let i = 0; i < Math.min(tokensData.length, 5); i++) {
//           const token = tokensData[i];
//           const valueInUSD = token.quote;
//           const radius = p.map(valueInUSD, 0, 100, 50, 200);
//           const xPos = -200 + i * 200;
//           const yPos = 0;
//           const zPos = 0;
//           const rotationAngle = p.frameCount * 0.01;
//           const sphereColor = getColorByToken(token.contract_name);
//           p.fill(sphereColor);
//           p.push();
//           p.translate(xPos, yPos, zPos);
//           p.rotateY(rotationAngle);
//           p.sphere(radius);
//           p.pop();

//           // Verificar clic en la esfera actual
//           const mousePos = p.createVector(
//             p.mouseX - p.width / 2,
//             p.mouseY - p.height / 2
//           );
//           const spherePos = p.createVector(xPos, yPos, zPos);
//           const distance = mousePos.dist(spherePos);
//           if (distance < radius && p.mouseIsPressed) {
//             // Verificar si se ha hecho clic
//             handleSphereClick(token); // Llamar a la función para manejar el clic en la esfera
//           }
//         }
//       };
//     };

//     const p5Instance = new p5(sketch, canvasRef.current);

//     return () => {
//       p5Instance.remove();
//     };
//   }, [tokensData]);

//   const getColorByToken = (tokenName) => {
//     switch (tokenName) {
//       case 'Ether':
//         return [255, 0, 255];
//       case 'Tether USD':
//         return [0, 255, 0];
//       case 'USD Coin':
//         return [0, 0, 255];
//       case 'Wrapped Ether':
//         return [255, 255, 0];
//       case 'Matic Token':
//         return [0, 255, 85];
//       default:
//         return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
//     }
//   };

//   const getData = async () => {
//     try {
//       const response = await fetch(
//         `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?key=${
//           import.meta.env.VITE_COVALENT_API_KEY
//         }`
//       );
//       const json = await response.json();
//       setTokensData(json.data.items);
//     } catch (error) {
//       console.error('Error fetching token data:', error);
//     }
//   };

//   const handleGetTokens = () => {
//     getData();
//   };

//   const handleSphereClick = (token) => {
//     // Aquí puedes realizar la acción que desees cuando se hace clic en una esfera
//     alert(
//       `Información del Token:\nNombre: ${token.contract_name}\nValor: ${token.quote}`
//     );
//   };

//   return (
//     <>
//       <video autoPlay loop muted className="video-background">
//         <source src={MATIVIDEO} type="video/mp4" />
//       </video>
//       <div className="covalent-token-viewer">
//         <h1 className="title">Covalent3DScan</h1>
//         <div className="input-container">
//           <label htmlFor="addressInput"> Address:</label>
//           <input
//             type="text"
//             id="addressInput"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             placeholder="Ethereum Address"
//           />
//           <button onClick={handleGetTokens}>Get Tokens and View in 3D</button>
//         </div>
//       </div>
//       <div
//         id="tokenText"
//         className="token-info-container"
//         ref={canvasRef}
//       ></div>
//       <div className="token-container">
//         {tokensData.map((token, index) => (
//           <div
//             key={index}
//             className={`token ${
//               selectedTokenIndex === index ? 'selected' : ''
//             }`}
//             onClick={() => setSelectedTokenIndex(index)}
//             style={{
//               backgroundColor: `rgb(${getColorByToken(token.contract_name).join(
//                 ','
//               )})`,
//             }}
//           >
//             <h2>{token.contract_name}</h2>
//             <h2>{token.quote}</h2>
//             <img
//               src={token.logo_url}
//               alt="Token Logo"
//               className="token-logo"
//               style={{ width: '64px', height: '64px' }}
//             />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default CovalentTokenViewer;
