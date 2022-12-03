import { CSSProperties, useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { particlesConfig } from "./ParticlesConfig";

interface HeaderBackgroundProps {
  styles?: {
    pageStyle?: CSSProperties;
    bodyStyle?: CSSProperties;
    headerStyle?: CSSProperties;
    scrollHeader?: CSSProperties;
  };
}

const TopContent = styled.div(({ theme }) => ({
  backgroundRepeat: "no-repeat",
  // backgroundImage: [
  //   `url(${DotsBg.src})`,
  //   linearGradient(theme.palette.primary.main),
  // ].join(", "),
  backgroundSize: [`auto 100%`, `100% 100%`].join(", "),
  backgroundPosition: "top center",
  backgroundColor: "#112632",
}));

const HeaderBackground = ({ styles, children }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );
  return (
    // <TopContent css={styles.pageStyle} style={{ minHeight: styles.height }}>
    <div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        css={{
          height: 600,
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
              value: 160,
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
              speed: 0,
              direction: "none",
              random: true,
              straight: true,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 600,
              },
            },
          },
          interactivity: {
            detect_on: "window",
            events: {
              onhover: {
                enable: true,
                mode: "attract",
              },
              resize: true,
            },
          },
          retina_detect: true,
          background: {
            color: "#112733",
          },
        }}
      />
      {children}
    </div>
  );
};

export default HeaderBackground;
