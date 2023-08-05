import React, { useCallback } from "react";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const HeaderBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  return (
    <div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        css={{
          height: 400,
          position: "absolute",
          "z-index": "-1",
          width: "100%",
        }}
        options={{
          fullScreen: {
            enable: false,
            zIndex: -1,
          },
          particles: {
            number: {
              value: 90,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#2DFEFE",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 1,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 4,
                size_min: 0.3,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.045,
              direction: "top",
              random: false,
              straight: true,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 10,
                rotateY: 10,
              },
            },
          },
          interactivity: {
            detect_on: "window",
            speed: 2,
            events: {
              onhover: {
                enable: true,
                mode: "attract",
              },
              resize: true,
            },
          },
          fpsLimit: 5,
          retina_detect: true,
          background: {
            color: "#000",
          },
        }}
      />
      {children}
    </div>
  );
};

export default HeaderBackground;
