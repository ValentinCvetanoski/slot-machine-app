import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import { Howl } from "howler";

// Global Styles
const GlobalStyle = createGlobalStyle`
body, html, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  background: url('${process.env.PUBLIC_URL || ""}/images/background.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #00ffff;
  user-select: none;
  overflow: hidden;
}
`;

// Animations
const dropIn = keyframes`
  0% { transform: translateY(-200%) scale(0.8); opacity: 0; }
  70% { transform: translateY(10%) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
`;
const glowAnimation = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000;
  }
  50% {
    box-shadow: 0 0 20px #ff4d4d, 0 0 40px #ff4d4d, 0 0 60px #ff4d4d, 0 0 80px #ff4d4d;
  }
`;
const explosionAnim = keyframes`
  0% { transform: scale(0.5); opacity: 1; }
  80% { transform: scale(1.5); opacity: 0.7; }
  100% { transform: scale(2); opacity: 0; }
`;
const spinningReel = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;
const blurSpin = keyframes`
  0% { filter: blur(0px); transform: translateY(0px); }
  50% { filter: blur(8px); transform: translateY(-20px); }
  100% { filter: blur(0px); transform: translateY(0px); }
`;
const jumpAnimation = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.1); }
`;
const fireAnimation = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px #ff4500) drop-shadow(0 0 40px #ff4500);
  }
  50% {
    filter: drop-shadow(0 0 30px #ff8c00) drop-shadow(0 0 60px #ff8c00);
  }
`;

// Styled Components
const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 20px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 768px) {
    padding: 10px 5px;
  }
`;

const Title = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  margin: 0 0 20px;
  text-shadow: 0 0 8px #0ff, 0 0 15px #0ff, 0 0 30px #0ff, 0 0 60px #0ff;
  user-select: none;
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 130px);
  grid-template-rows: repeat(3, 130px);
  gap: 10px;
  perspective: 1000px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 50px);
    grid-template-rows: repeat(3, 50px);
    gap: 5px;
  }
`;

const Slot = styled.div`
  width: 130px;
  height: 130px;
  background: #11121a;
  border-radius: 15px;
  box-shadow: inset 0 0 15px #0ff, 0 0 30px #0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #00ffff;
  user-select: none;
  backface-visibility: hidden;
  opacity: 1;
  animation: ${props => css`${dropIn} 0.6s ease forwards`};
  animation-delay: ${props => props.$delay}s;
  &.win-glow {
    animation: ${css`${glowAnimation}`} 1.5s ease-in-out infinite;
    box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000;
  }
  &.spinning {
    animation: ${css`${blurSpin}`} 0.6s ease-in-out infinite;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
    user-select: none;
    transition: transform 0.3s ease;
    &.spinning {
      animation: ${css`${spinningReel}`} 0.3s linear infinite;
    }
  }
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const BonusWin = styled.div`
  position: fixed;
  top: 25%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${css`${jumpAnimation}`} 1s ease-in-out infinite, ${css`${fireAnimation}`} 1.5s ease-in-out infinite;
  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
    /* Center horizontally for mobile without changing top/left */
    left: 23%;
    transform: translate(-50%, -50%);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
  }
`;

const Controls = styled.div`
  margin-top: 20px;
  width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    padding: 0;
    gap: 5px;
  }
`;

const BalanceText = styled.div`
  font-size: 1.4rem;
  user-select: none;
  flex: 1;
  min-width: 150px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BetOptions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    justify-content: center;
    gap: 4px;
  }
`;

const Button = styled.button`
  background: #11121a;
  color: #00ffff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 0 12px #0ff, inset 0 0 6px #0ff;
  transition: background 0.3s;
  &.active {
    background: #00ffff;
    color: #11121a;
    box-shadow: 0 0 15px #0ff, inset 0 0 9px #0ff;
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  &:hover:not(:disabled):not(.active) {
    background: #00ffff44;
  }
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
`;

const SpinButton = styled(Button)`
  margin-left: 10px;
  background: #00ffff;
  color: #11121a;
  font-weight: 900;
  font-size: 1.5rem;
  padding: 12px 25px;
  &:hover:not(:disabled) {
    background: #00ffffcc;
  }
  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 1.2rem;
    padding: 10px 20px;
  }
`;

const AddMoneyButton = styled(Button)`
  background: #002222;
  border: 2px solid #00ffff;
  &:hover:not(:disabled) {
    background: #00ffff;
    color: #11121a;
  }
`;

const ValueTableButton = styled(AddMoneyButton)`
  background: #220022;
  border-color: #ff00ff;
  &:hover:not(:disabled) {
    background: #ff00ff;
    color: #111;
  }
`;

const WinCounter = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #00ffffdd;
  color: #0a0a12;
  font-weight: 900;
  padding: 15px 30px;
  border-radius: 15px;
  font-size: 1.8rem;
  box-shadow: 0 0 25px #00ffff;
  user-select: none;
  opacity: ${prop => (prop.$show ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.5s;
  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 1rem;
    bottom: 5px;
    right: 5px;
  }
`;

const PaylineInfo = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #11121add;
  color: #00ffff;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 1.1rem;
  box-shadow: 0 0 15px #00ffff;
  user-select: none;
  opacity: ${prop => (prop.$show ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.5s;
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.9rem;
    bottom: 5px;
    left: 5px;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #11121a;
  border-radius: 15px;
  box-shadow: 0 0 25px #00ffff;
  padding: 1.5rem 2.5rem;
  max-width: 400px;
  max-height: 75vh;
  overflow-y: auto;
  text-align: center;
  color: #00ffff;
  @media (max-width: 768px) {
    width: 85vw;
    padding: 1rem;
  }
`;

const ModalTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.8rem;
  text-shadow: 0 0 5px #0ff, 0 0 15px #0ff;
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ModalButton = styled.button`
  margin-top: 1rem;
  padding: 10px 20px;
  font-size: 1.1rem;
  background: #00ffff;
  border: none;
  border-radius: 12px;
  color: #11121a;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 0 15px #0ff;
  transition: 0.3s;
  &:hover {
    background: #00ffffcc;
  }
  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.8rem;
  color: #00ffff;
  th, td {
    border: 1px solid #00ffff55;
    padding: 6px 10px;
  }
  th {
    background: #001122;
  }
  @media (max-width: 768px) {
    font-size: 0.7rem;
    th, td {
      padding: 3px 5px;
    }
  }
`;

const ParticleContainer = styled.div`
  position: fixed;
  pointer-events: none;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  width: 80px;
  height: 80px;
  z-index: 1000;
`;

const Particle = styled.div`
  position: absolute;
  background: #00ffff;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: ${props => css`${explosionAnim} 700ms forwards`};
  animation-delay: ${props => props.delay}ms;
`;

// Symbol definitions
const faces = [
  "zeki", "tehno", "bojche_koks", "aco_resen", "sigma",
  "tino", "cele", "zarzin",
];
const symbolsWeighted = [
  ...Array(20).fill("zeki"),
  ...Array(11).fill("zarzin"),
  ...Array(20).fill("tehno"),
  ...Array(15).fill("bojche_koks"),
  ...Array(15).fill("aco_resen"),
  ...Array(11).fill("sigma"),
  ...Array(11).fill("tino"),
  ...Array(9).fill("cele"),
  ...Array(6).fill("wild"),
  ...Array(5).fill("seven"),
  ...Array(4).fill("paleni_bonus")
];
const DENOMS = [5, 10, 20, 50, 100, 500, 1000];
const payoutTable = {
  zeki: 2,
  tehno: 3,
  zarzin: 4,
  bojche_koks: 5,
  aco_resen: 8,
  sigma: 12,
  tino: 18,
  cele: 25,
  wild: 50,
  seven: 80,
  bonus: 0,
};
const totalSlots = 15;
const paylines = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [0, 6, 12, 8, 4],
  [10, 6, 2, 8, 14],
  [0, 6, 7, 8, 9],
  [10, 6, 7, 8, 9],
  [0, 1, 7, 13, 14],
  [10, 11, 7, 3, 4],
];
const paylineNames = [
  "Top Row",
  "Middle Row",
  "Bottom Row",
  "Diagonal Down",
  "Diagonal Up",
  "V-Shape Top",
  "V-Shape Bottom",
  "Inverted V Top",
  "Inverted V Bottom"
];

function App() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(5);
  const [slots, setSlots] = useState(Array(totalSlots).fill("zeki"));
  const [spinning, setSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showWinCounter, setShowWinCounter] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [showValueTable, setShowValueTable] = useState(false);
  const [winningIndices, setWinningIndices] = useState([]);
  const [winningPayline, setWinningPayline] = useState("");
  const [showPaylineInfo, setShowPaylineInfo] = useState(false);
  const [reelSpinning, setReelSpinning] = useState(Array(totalSlots).fill(false));
  const [showBonusWin, setShowBonusWin] = useState(false); // <-- For BonusWin image
  const winCountRef = useRef(null);

  // Audio refs
  const audioRefs = useRef({
    bonus: null,
    hugewin: null,
    maxwin: null,
    reelstop: null,
    spin: null,
    win: null
  });

  // Initialize audio
  useEffect(() => {
    audioRefs.current = {
      bonus: new Howl({ src: [`${process.env.PUBLIC_URL || ""}/sounds/bonus.mp3`] }),
      hugewin: new Howl({ src: [`${process.env.PUBLIC_URL || ""}/sounds/hugewin.mp3`] }),
      maxwin: new Howl({ src: [`${process.env.PUBLIC_URL || ""}/sounds/maxwin.mp3`] }),
      reelstop: new Howl({ src: [`${process.env.PUBLIC_URL || ""}/sounds/reelstop.mp3`] }),
      spin: new Howl({ src: [`${process.env.PUBLIC_URL || ""}/sounds/spin.mp3`] }),
      win: new Howl({ src: [`${process.env.PUBLIC_URL || ""}/sounds/win.mp3`] })
    };
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume(0.3);
      audio.load();
    });
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.unload();
      });
    };
  }, []);

  const playSound = (soundName) => {
    try {
      const audio = audioRefs.current[soundName];
      if (audio) {
        audio.stop();
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (error) {
      console.log('Sound play error:', error);
    }
  };

  useEffect(() => {
    if (showWinCounter) {
      const timeout = setTimeout(() => {
        setShowWinCounter(false);
        setShowPaylineInfo(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [showWinCounter]);

  useEffect(() => {
    const onKeyDown = e => {
      if (e.code === "Space" && !spinning) spin();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [spinning, bet, balance, freeSpins]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!spinning && e.deltaY > 0 && (freeSpins > 0 || balance >= bet)) {
        e.preventDefault();
        spin();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [spinning, bet, balance, freeSpins]);

  const getRandomSymbol = () =>
    symbolsWeighted[Math.floor(Math.random() * symbolsWeighted.length)];

  const getRandomSymbolForIndex = (index) => {
    const col = index % 5;
    if (col === 0 || col === 4) {
      const filteredSymbols = symbolsWeighted.filter(s => s !== "wild");
      return filteredSymbols[Math.floor(Math.random() * filteredSymbols.length)];
    } else {
      return getRandomSymbol();
    }
  };

  const triggerExplosions = (count) => {
    let exps = [];
    for (let i = 0; i < count; i++) {
      exps.push({
        id: i,
        x: Math.random() * window.innerWidth * 0.8 + 50,
        y: Math.random() * window.innerHeight * 0.6 + 50,
        delay: i * 100
      });
    }
    setExplosions(exps);
    setTimeout(() => setExplosions([]), 1000);
  };

  const spin = () => {
    if (spinning) return;
    if (freeSpins === 0 && balance < bet) return;
    if (freeSpins > 0) {
      setFreeSpins(fs => fs - 1);
    } else {
      setBalance(b => b - bet);
    }
    setWinningIndices([]);
    setWinningPayline("");
    setSpinning(true);
    playSound('spin');
    setReelSpinning(Array(totalSlots).fill(true));
    let next = [...slots];
    for (let i = 0; i < totalSlots; i++) {
      const col = i % 5;
      setTimeout(() => {
        next[i] = getRandomSymbolForIndex(i);
        setSlots([...next]);
        setReelSpinning(prev => {
          const newState = [...prev];
          newState[i] = false;
          return newState;
        });
        playSound('reelstop');
        if (i === totalSlots - 1) {
          setSpinning(false);
          setReelSpinning(Array(totalSlots).fill(false));
          evaluate(next);
        }
      }, 200 * col + 100 * Math.floor(i / 5));
    }
  };

  const evaluate = (result) => {
    let bestWin = 0;
    let bestWinningSlots = [];
    let bestPaylineName = "";
    paylines.forEach((line, index) => {
      const lineSymbols = line.map(pos => result[pos]);
      const { amount, indices } = calcLineWin(lineSymbols, line);
      if (amount > bestWin) {
        bestWin = amount;
        bestWinningSlots = indices;
        bestPaylineName = paylineNames[index];
      }
    });
    if (bestWin > 0) {
      setBalance(b => b + bestWin);
      setWinAmount(bestWin);
      setShowWinCounter(true);
      setWinningIndices(bestWinningSlots);
      setWinningPayline(bestPaylineName);
      setShowPaylineInfo(true);
      const multiplier = bestWin / bet;
      if (multiplier >= 100) {
        playSound('maxwin');
        triggerExplosions(30);
        setShowBonusWin(true);
        setTimeout(() => setShowBonusWin(false), 2000);
      } else if (multiplier >= 30) {
        playSound('hugewin');
        triggerExplosions(20);
        setShowBonusWin(true);
        setTimeout(() => setShowBonusWin(false), 2000);
      } else {
        playSound('win');
        if (multiplier >= 10) {
          triggerExplosions(10);
        }
      }
    } else {
      setWinningIndices([]);
      setWinningPayline("");
    }
    const bonusCount = result.filter(s => s === "paleni_bonus").length;
    if (bonusCount >= 3) {
      setFreeSpins(fs => fs + 5);
      setShowBonusModal(true);
      setShowBonusWin(true);
      setTimeout(() => setShowBonusWin(false), 2000);
      playSound('bonus');
    }
  };

  const calcLineWin = (lineSymbols, lineIndices) => {
    let maxWin = 0;
    let winningIndices = [];
    const firstSymbol = lineSymbols[0];
    if (firstSymbol === "paleni_bonus") return { amount: 0, indices: [] };
    const candidates = firstSymbol === "wild"
      ? Object.keys(payoutTable).filter(s => s !== "wild" && s !== "bonus")
      : [firstSymbol];
    candidates.forEach(sym => {
      let count = 0;
      let indices = [];
      for (let i = 0; i < lineSymbols.length; i++) {
        const s = lineSymbols[i];
        if (s === sym || s === "wild") {
          count++;
          indices.push(lineIndices[i]);
        } else {
          break;
        }
      }
      if (count >= 3 && payoutTable[sym]) {
        let multiplier = 1;
        if (count === 4) multiplier = 2;
        else if (count === 5) multiplier = 5;
        const amount = bet * payoutTable[sym] * multiplier;
        if (amount > maxWin) {
          maxWin = amount;
          winningIndices = indices;
        }
      }
    });
    return { amount: maxWin, indices: winningIndices };
  };

  const addMoney = () => {
    setBalance(b => b + 100);
  };

  const [displayWin, setDisplayWin] = useState(0);
  useEffect(() => {
    if (showWinCounter) {
      let start = 0;
      const step = winAmount / 40;
      const interval = setInterval(() => {
        start += step;
        if (start >= winAmount) {
          start = winAmount;
          clearInterval(interval);
        }
        setDisplayWin(Math.floor(start));
      }, 25);
      return () => clearInterval(interval);
    } else {
      setDisplayWin(0);
    }
  }, [showWinCounter, winAmount]);

  useEffect(() => {
    if (showBonusModal) {
      const t = setTimeout(() => setShowBonusModal(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showBonusModal]);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Title>ШТРАКАЊЕ</Title>
        <SlotGrid>
          {slots.map((sym, i) => (
            <Slot
              key={i}
              className={
                (winningIndices.includes(i) ? "win-glow " : "") +
                (reelSpinning[i] ? "spinning" : "")
              }
              $delay={0.05 * (i % 5)}
            >
              <img
                src={`${process.env.PUBLIC_URL || ""}/images/${sym}.png`}
                alt={sym}
                draggable={false}
                className={reelSpinning[i] ? "spinning" : ""}
              />
            </Slot>
          ))}
        </SlotGrid>
        <Controls>
          <BalanceText>Баланс: {balance} MKD</BalanceText>
          <BetOptions>
            {DENOMS.map(d => (
              <Button
                key={d}
                className={bet === d ? "active" : ""}
                onClick={() => setBet(d)}
                disabled={spinning || balance < d}
              >
                {d} MKD
              </Button>
            ))}
          </BetOptions>
          <SpinButton
            onClick={spin}
            disabled={spinning || (freeSpins === 0 && balance < bet)}
          >
            {freeSpins > 0 ? `Free Spin (${freeSpins})` : "ШТРАКАЈ"}
          </SpinButton>
          <AddMoneyButton onClick={addMoney} disabled={spinning}>
            Клај едно стотче
          </AddMoneyButton>
          <ValueTableButton onClick={() => setShowValueTable(true)} disabled={spinning}>
            Џабе се пулиш
          </ValueTableButton>
        </Controls>
        <PaylineInfo $show={showPaylineInfo}>
          {winningPayline} - {Math.floor(displayWin / bet)}x
        </PaylineInfo>
        <WinCounter $show={showWinCounter}>
          Победа: {displayWin} MKD
        </WinCounter>
        {showBonusWin && (
          <BonusWin>
            <img
              src={`${process.env.PUBLIC_URL || ""}/images/bonuswin.png`}
              alt="Bonus Win"
              draggable={false}
            />
          </BonusWin>
        )}
        {showBonusModal && (
          <ModalBackdrop onClick={() => setShowBonusModal(false)}>
            <ModalBox onClick={e => e.stopPropagation()}>
              <ModalTitle>Бонус Игра!</ModalTitle>
              <div>Освоивте 5 бесплатни вртења!</div>
              <img
                src={`${process.env.PUBLIC_URL || ""}/images/paleni_bonus.png`}
                alt="Bonus"
                style={{ width: "120px", margin: "20px auto" }}
                draggable={false}
                onClick={() => setShowBonusModal(false)}
              />
            </ModalBox>
          </ModalBackdrop>
        )}
        {showValueTable && (
          <ModalBackdrop onClick={() => setShowValueTable(false)}>
            <ModalBox onClick={e => e.stopPropagation()} style={{ position: "relative" }}>
              <ModalTitle>Табела на исплати (90% RTP)</ModalTitle>
              <div>9 активни линии за исплата</div>
              <Table>
                <thead>
                  <tr>
                    <th>Симбол</th>
                    <th>3 во ред</th>
                    <th>4 во ред</th>
                    <th>5 во ред</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(payoutTable)
                    .filter(([sym]) => sym !== "bonus")
                    .map(([sym, val]) => (
                      <tr key={sym}>
                        <td>
                          <img
                            src={`${process.env.PUBLIC_URL || ""}/images/${sym}.png`}
                            alt={sym}
                            style={{ width: "32px", verticalAlign: "middle" }}
                            draggable={false}
                          />
                        </td>
                        <td>{val * bet}</td>
                        <td>{val * bet * 2}</td>
                        <td>{val * bet * 5}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <ModalButton onClick={() => setShowValueTable(false)}>Затвори</ModalButton>
            </ModalBox>
          </ModalBackdrop>
        )}
        {explosions.length > 0 &&
          explosions.map(({ id, x, y, delay }) => (
            <ParticleContainer key={id} x={x} y={y}>
              <Particle delay={delay} />
            </ParticleContainer>
          ))}
      </Wrapper>
    </>
  );
}

export default App;
