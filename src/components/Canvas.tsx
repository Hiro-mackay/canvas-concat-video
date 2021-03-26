import React, { FC, MutableRefObject, useEffect, useRef } from 'react';

interface Canvas {
  timer: number;
  initApp: (ref: HTMLCanvasElement) => void;
  play: () => void;
  stop: () => void;
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const Canvas: FC<Canvas> = (props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    props.initApp(ref.current);
  }, [ref]);
  return (
    <>
      <div
        style={{
          width: '100%',
          maxWidth: 800,
          height: '100%',
          position: 'relative',
          margin: 'auto'
        }}
      >
        <div
          style={{
            width: '100%',
            paddingTop: '56.25%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <canvas
            ref={ref}
            width={100}
            height={100}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
              left: '0',
              backgroundColor: '#ffffff'
            }}
          ></canvas>
        </div>
      </div>
      <p>{props.timer}</p>
      <input type="file" onChange={props.handleChange} />
      <p>
        <button onClick={props.play}>再生</button>
      </p>
      <p>
        <button onClick={props.stop}>ストップ</button>
      </p>
    </>
  );
};
