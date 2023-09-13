import { useEffect } from "react";
import { Column, styled } from "@ecoinc/ecomponents";
import Image from "next/image";
import Link from "next/link";

import { breakpoints, mq } from "../../../utilities";
import EcoLogoImg from "../../../public/images/eco-logo/eco-logo-white-outline.svg";
import CloseImg from "../../../public/images/close.svg";
import { WalletItem } from "./WalletItem";

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
          <WalletItem />
        </Column>
      </Column>
    </NavContainer>
  );
};

export default MobileNav;
