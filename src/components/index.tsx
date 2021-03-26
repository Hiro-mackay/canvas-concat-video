import { FC, memo, MutableRefObject, useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Canvas } from './Canvas';

interface IPlayer {
  currentTime: number; // 秒
  viewingTime: number; // 秒
  delterTime: number; //秒
  isPlay: boolean; //  If true, play the player
  video: HTMLVideoElement; // current play resource
  next: PIXI.Texture; // next play resource buffer
  resource: Array<IVideoResource>;
}

interface IVideoResource {
  texture: PIXI.Texture;
  start: number;
  end: number;
  deltaStart: number;
}
const Player: IPlayer = {
  currentTime: 0,
  viewingTime: 0,
  delterTime: 0,
  isPlay: false,
  video: null,
  next: null,
  resource: []
};
const Component: FC = memo(() => {
  const [app, setApp] = useState<PIXI.Application>();
  const [timer, setTimer] = useState(Player.currentTime);

  const setSprite = (texture: PIXI.Texture) => {
    const videoSprite = PIXI.Sprite.from(texture);
    videoSprite.width = app.screen.width;
    videoSprite.height = app.screen.height;
    app.stage.addChild(videoSprite);

    // @ts-ignore
    Player.video = videoSprite.texture.baseTexture.resource.source as HTMLVideoElement;
  };

  const load = () => {
    const currentAsset = Player.resource.filter((v) => {
      return v.start <= Player.currentTime && Player.currentTime <= v.end;
    });

    if (currentAsset.length === 0) {
      console.error(`not found asset at ${Player.currentTime}`);
      return;
    }
    setSprite(currentAsset[0].texture);

    Player.video.pause();
  };

  const preload = () => {
    const currentSpriteIndex = Player.resource.findIndex((sprite) => {
      return (
        sprite.start + sprite.deltaStart <= Player.currentTime && Player.currentTime < sprite.end + sprite.deltaStart
      );
    });

    if (currentSpriteIndex >= 0 && Player.resource.length - 1 >= currentSpriteIndex + 1) {
      const nextSpriteIndex = currentSpriteIndex + 1;

      Player.next = Player.resource[nextSpriteIndex].texture;
    } else {
      Player.next = null;
    }
  };

  const setAsset = (file: File) => {
    const path = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = '';
    video.src = path;
    video.pause();

    video.onloadeddata = () => {
      const duration = video.duration;
      const texture = PIXI.Texture.from(video);

      const VideoResource: IVideoResource = {
        texture: texture,
        start: 0,
        end: duration,
        deltaStart: Player.viewingTime
      };

      Player.resource.push(VideoResource);
      Player.viewingTime += duration;
      if (!Player.video) {
        load();
      } else if (!Player.next) {
        preload();
      }
    };
  };

  const nextSprite = () => {
    console.log(Player.next);
    if (!Player.next) {
      console.log('not found next texture');
      playerTogglePlayState();
      return;
    }

    Player.delterTime += Player.video.duration;

    setSprite(Player.next);
    preload();
    if (Player.video.paused) {
      Player.video.play();
    }
  };

  const loop = () => {
    if (!Player.isPlay) return;

    Player.currentTime = Player.video.currentTime + Player.delterTime;
    setTimer(Player.currentTime);
    if (Player.video.paused) {
      nextSprite();
    }

    requestAnimationFrame(loop);
  };

  const playerTogglePlayState = () => {
    Player.isPlay = !Player.isPlay;
  };

  const playerPlay = () => {
    Player.video.play();
    playerTogglePlayState();
    loop();
  };

  const playerStop = () => {
    console.log(Player);
    playerTogglePlayState();
    Player.video.pause();
  };

  const play = () => {
    if (!Player.video) {
      console.error('Not set sprite');
    }
    playerPlay();
  };

  const stop = () => {
    playerStop();
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files.length) {
      console.error('not set asset');
      return;
    }
    setAsset(e.currentTarget.files[0]);
    e.currentTarget.files = null;
  };

  const initApp = (ref: HTMLCanvasElement) => {
    const _app = new PIXI.Application({
      view: ref,
      backgroundColor: 0xffffff
    });
    setApp(_app);
  };

  return (
    <main
      style={{
        width: '90vw',
        height: '60vh',
        backgroundColor: '#3c3c3c',
        padding: '0 30px',
        boxSizing: 'border-box'
      }}
    >
      <Canvas timer={timer} play={play} stop={stop} handleChange={handleChange} initApp={initApp} />
    </main>
  );
});
export default Component;
