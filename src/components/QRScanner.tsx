import {
  IDetectedBarcode,
  Scanner,
  useDevices,
} from "@yudiel/react-qr-scanner";
import React, { useCallback, useMemo, useState } from "react";
import "./QRScanner.css";

interface containerProps {
  pause: boolean;
}

const QRScanner: React.FC<containerProps> = ({ pause = false }) => {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const devices = useDevices();

  const scanSize = 300; //px
  const borderWidth = 5; //px
  const borderColor = "#ffffff";

  const onScan = useCallback((results: IDetectedBarcode[]) => {
    const result = results[0];

    console.log(result);
  }, []);

  const margin = useMemo(() => {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const tabBarHeight = 56;
    const width = windowWidth;
    const height = windowHeight - tabBarHeight;

    const leftMargin = (width - scanSize) / 2;
    const topMargin = (height - scanSize) / 2;

    return {
      left: leftMargin,
      top: topMargin,
    };
  }, [window, scanSize]);

  const clipPath = useMemo(() => {
    const leftX = `${margin.left}px`;
    const rightX = `${margin.left + scanSize}px`;
    const topY = `${margin.top}px`;
    const bottomY = `${margin.top + scanSize}px`;

    return `polygon(0% 0%, 0% 100%, ${leftX} 100%, ${leftX} ${topY}, ${rightX} ${topY}, ${rightX} ${bottomY}, ${leftX} ${bottomY}, ${leftX} 100%, 100% 100%, 100% 0%)`;
  }, [window, scanSize]);

  return (
    <Scanner
      onScan={onScan}
      formats={["qr_code"]}
      allowMultiple={false}
      scanDelay={500}
      components={{
        audio: false,
        finder: false,
      }}
      paused={pause}
      styles={{
        video: {
          height: "100%",
          width: "auto",
        },
      }}
      constraints={{
        deviceId: deviceId,
      }}
    >
      <div
        className="scanner-overlay"
        style={{
          clipPath: clipPath,
        }}
      ></div>
      <div
        className="scanner-top"
        style={{
          height: `${margin.top}px`,
        }}
      >
        <div>請將QR Code放進框內掃描</div>
      </div>
      <div
        className="scanner-bottom"
        style={{
          height: `${margin.top}px`,
        }}
      ></div>
      <svg
        width={scanSize - 20}
        height={scanSize - 20}
        viewBox="0 0 230 230"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: margin.top - borderWidth / 2 + 10,
          left: margin.left - borderWidth / 2 + 10,
        }}
      >
        <path
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M165,5 
             H198.2 
             A25,25 0 0 1 225,30.79 
             V65"
        />
        <path
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5,65 
             V31.8 
             A25,25 0 0 1 30.79,5 
             H65"
        />
        <path
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M165,225 
             H198.2 
             A25,25 0 0 0 225,199.21 
             V165"
        />
        <path
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5,165 
             V198.2 
             A25,25 0 0 0 30.79,225 
             H65"
        />
      </svg>
    </Scanner>
  );
};

export default QRScanner;
