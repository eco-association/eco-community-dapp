import React from "react";
import { EcoTheme, CustomEcoTheme } from "@ecoinc/ecomponents";
import { css, Global } from "@emotion/react";

const IBMPlexMonoFontCss = css`
  @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap");
`;

const BackgroundColor = css`
  body {
    background-color: #f6f9fb !important;
    min-height: 100vh;
  }
`;

const ecoTheme: CustomEcoTheme = {
  palette: {
    primary: {
      main: "#112733",
      bg: "#F6F9FB",
      bgDark: "#2566F5",
      contrastText: "#FFFFFF",
    },
    disabled: {
      main: "#DEE6EB",
      bg: "#F6F9FB",
      bgDark: "#F6F9FB",
      contrastText: "#5F869F",
    },
    error: {
      contrastText: "#510408",
    },
    background: {
      light: "#EFF8FE",
    },
  },
  typography: {
    subtitle1: {
      fontSize: 10,
    },
  },
  components: {
    card: {
      borderRadius: 8,
      borderColor: "#F1F7FA",
    },
    alert: {
      fontSize: 13,
    },
    dialog: {
      overlay: {
        backgroundColor: "#112733E5",
        zIndex: 10,
      },
    },
  },
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <React.Fragment>
      <Global styles={IBMPlexMonoFontCss} />
      <Global styles={BackgroundColor} />
      <EcoTheme theme={ecoTheme}>{children}</EcoTheme>
    </React.Fragment>
  );
};
