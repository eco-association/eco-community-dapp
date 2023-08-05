import React, { useEffect } from "react";
import { Button, Column, Typography, styled } from "@ecoinc/ecomponents";
import Image from "next/image";
import Link from "next/link";

import { breakpoints, mq } from "../../../utilities";
import EcoLogoImg from "../../../public/images/eco-logo/eco-logo-white-outline.svg";
import CloseImg from "../../../public/images/close.svg";
import CopyIcon from "../../../public/images/Copy.svg";
import ShareIcon from "../../../public/images/Share-colored.svg";

const NavContainer = styled.div(({ show }: { show: boolean }) => ({
  width: "100%",
  background: "#000",
  position: "fixed",
  top: "0",
  left: "0",
  zIndex: show ? "20" : "0",
  height: "100vh",
  overflowY: "scroll",
  opacity: show ? 1 : 0,
  pointerEvents: show ? "all" : "none",
  visibility: show ? "visible" : "hidden",
  transform: show ? "scale(1)" : "scale(0.95)",
  transition: "opacity 0.5s, transform 0.5s",

  [mq(breakpoints.lg)]: {
    display: "none",
  },
}));

const NavHeader = styled.div({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "25px 24px 16px",
});

const Divider = styled.div({
  width: "100%",
  borderTop: "1px solid #fff",
  marginTop: "48px",
});

const TextContainer = styled.div({
  display: "flex",
  alignItems: "center",
});

const DisconnectButton = styled(Button)({
  backgroundColor: "#DEE6EB",
  color: "#22313A",
});

const Dot = styled.span({
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#56D9B6",
  display: "inline-block",
  marginRight: "4px",
});

const styles = {
  colorMed: { color: "#5F869F !important" },
  outerPadding: { padding: "32px 44px" },
  spaceRight: { marginRight: "10px" },
  alignCenter: { display: "flex", placeItems: "center" },
  innerPadding: {
    padding: "32px 44px",
    background: "rgba(255, 255, 255, 0.05)",
  },
};

const MobileNav = ({ show, navLinks, onClick }) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add("body-fixed");
    } else {
      document.body.classList.remove("body-fixed");
    }
  }, [show]);

  return (
    <NavContainer show={show}>
      <NavHeader>
        <Link href="/">
          <Image src={EcoLogoImg} alt="logo" />
        </Link>

        <Column justify="center" onClick={onClick}>
          <Image src={CloseImg} alt="close" />
        </Column>
      </NavHeader>

      <Column css={styles.outerPadding}>
        <Column
          css={{
            gap: "44px",
          }}
        >
          {navLinks}
        </Column>

        <Divider />
      </Column>

      <Column css={styles.outerPadding}>
        <Column css={styles.innerPadding} gap="xxl">
          <TextContainer>
            <Typography color="white" variant="body2" css={styles.spaceRight}>
              0x830s38•••6cl28cf1
            </Typography>
            <Image src={CopyIcon} alt="copy" />
          </TextContainer>

          <TextContainer>
            <Typography color="white" variant="body2" css={styles.spaceRight}>
              View on Explorer
            </Typography>
            <Image src={ShareIcon} alt="share" />
          </TextContainer>

          <TextContainer>
            <Typography
              color="white"
              variant="body2"
              css={{ ...styles.spaceRight, ...styles.alignCenter }}
            >
              <Dot /> ETH
            </Typography>
            <Typography variant="body2" css={styles.colorMed}>
              Network
            </Typography>
          </TextContainer>

          <DisconnectButton>Disconnect</DisconnectButton>
        </Column>
      </Column>
    </NavContainer>
  );
};

export default MobileNav;
