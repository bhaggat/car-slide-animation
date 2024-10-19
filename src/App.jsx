import { useState, useEffect, useRef } from "react";
import "./App.css";
import CarIcon from "./CarIcon";

function extractNumber(str) {
  const numberString = str.replace(/[^0-9.-]+/g, "");
  const number = parseFloat(numberString);
  return isNaN(number) ? null : number;
}

function App() {
  const [lane, setLane] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollSectionRef = useRef(null);
  const carLane = useRef(null);

  useEffect(() => {
    let oldDirection = "right";
    let oldScrollPercent = 0;
    let isTurning = false;
    let timer;
    const handleScroll = () => {
      setHasScrolled(true);
      const scrollElement = scrollSectionRef.current;
      const scrollTop = scrollElement.scrollTop;
      const scrollHeight =
        scrollElement.scrollHeight - scrollElement.clientHeight;
      const newScrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      const newDirection =
        oldScrollPercent > newScrollPercent ? "left" : "right";
      const isPercentChanged = oldScrollPercent !== newScrollPercent;

      if (isPercentChanged) {
        oldScrollPercent = newScrollPercent;
        const isTurningNew = oldDirection !== newDirection;
        if (isTurningNew) {
          oldDirection = newDirection;
          isTurning = true;
          timer = setTimeout(() => {
            isTurning = false;
            carLane.current.style.left = `${oldScrollPercent}%`;
          }, 400);
        } else if (!isTurning) {
          carLane.current.style.left = `${newScrollPercent}%`;
        }

        if (scrollTop > scrollElement.prevScrollTop) {
          setLane(1);
        } else {
          setLane(2);
        }
        scrollElement.prevScrollTop = scrollTop;
      }
    };

    const scrollElement = scrollSectionRef.current;
    scrollElement.prevScrollTop = scrollElement.scrollTop;
    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      timer && clearTimeout(timer);
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (hasScrolled) {
      const oldDeg = extractNumber(carLane.current.style.transform);
      const newDeg = oldDeg + 180;
      carLane.current.style.transform = `rotate(${newDeg}deg)`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lane]);

  return (
    <div className="container">
      <div className="road-section">
        <div className="road lane-1" />
        <div className="road lane-2" />
        <div className="car-route">
          <div
            className={`car ${
              hasScrolled ? `car-lane-${lane}` : "initial-car-position"
            }`}
            ref={carLane}
          >
            <CarIcon />
          </div>
        </div>
      </div>
      <div className="scroll-section" ref={scrollSectionRef}>
        <p>Scroll up and down to move the car.</p>
        <div style={{ height: "400vh" }}></div>
      </div>
    </div>
  );
}

export default App;
