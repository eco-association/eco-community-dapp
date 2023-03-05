import React, { CSSProperties, useMemo, useRef, useState } from "react";
import { Button, Column, Row, styled, Typography } from "@ecoinc/ecomponents";
import Image from "next/image";
import EcoLogoImg from "../../../public/images/eco-gov-logo.svg";
import Menu from "../../../public/images/menu.svg";
import DotsBg from "../../../public/images/dots.svg";
import Close from "../../../public/images/close.svg";
import Ecologo from "../../../public/images/logo.svg";
import Copy from "../../../public/images/Copy.svg";
import Share from "../../../public/images/Share.svg";
import { useScrollExceeds } from "../../hooks/useScrollExceeds";
import { HeaderItem } from "./HeaderItem";
import { WalletItem } from "./WalletItem";
import Link from "next/link";
import { useAccount } from "wagmi";
import { css } from "@emotion/react";

const linearGradient = (color: string) => `linear-gradient(${color}, ${color})`;

const PageContainer = styled.div<{ height: number }>(({ theme, height }) => ({
  backgroundRepeat: "no-repeat",
  backgroundImage: [
    `url(${DotsBg.src})`,
    linearGradient(theme.palette.primary.main),
    linearGradient(theme.palette.background.paper),
  ].join(", "),
  backgroundSize: [`auto ${height}px`, `100% ${height}px`, "auto"].join(", "),
  backgroundPosition: "top center",
  minHeight: "100vh",
}));

const TopContent = styled.div(({ theme }) => ({
  backgroundRepeat: "no-repeat",
  backgroundImage: [
    `url(${DotsBg.src})`,
    linearGradient(theme.palette.primary.main),
  ].join(", "),
  backgroundSize: [`auto 100%`, `100% 100%`].join(", "),
  backgroundPosition: "top center",
}));

const BottomContent = styled.div(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const HeaderContainer = styled(Row)(({ theme, showBg, fixed }) => ({
  width: "100%",
  padding: "32px 52px 16px 64px",
  top: 0,
  left: 0,
  zIndex: 10,
  transition: "background ease .2s",
  ...(fixed ? { position: "fixed" } : {}),
  ...(showBg
    ? { backgroundColor: theme.palette.primary.main }
    : { backgroundColor: "transparent" }),
}));

const BodyContainer = styled.div({
  maxWidth: 980,
  margin: "0 auto",
});

const Space = styled.div({ flexGrow: 1 });

type PageName = "home" | "proposals" | "forum" | "account" | "authorize";

export interface HeaderProps {
  current: PageName;
  content?: React.ReactNode;
  scrollHeader?: React.ReactNode;
  height?: number;
  breakpoint?: number;
  styles?: {
    pageStyle?: CSSProperties;
    bodyStyle?: CSSProperties;
    headerStyle?: CSSProperties;
    scrollHeader?: CSSProperties;
  };
}

interface Link {
  label: string;
  href: string;
  name: PageName;
  external?: boolean;
}

const links: Link[] = [
  { label: "Home", name: "home", href: "/" },
  { label: "Proposals", name: "proposals", href: "/proposals" },
  {
    label: "Forum",
    name: "forum",
    href: "https://forums.eco.org/",
    external: true,
  },
  { label: "My Account", name: "account", href: "/account" },
];

const Logo = css({
  cursor: "pointer",
});

export const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  children,
  current = "home",
  height = 315,
  content,
  scrollHeader,
  styles: customStyles,
  breakpoint = 200,
}) => {
  const account = useAccount();
  const topRef = useRef<HTMLDivElement>();
  const showBg = useScrollExceeds(breakpoint);
  const headerFixed = useScrollExceeds(topRef.current?.offsetTop || 0);
  const [showNav, setShowNav] = useState(false);

  const fixed = !content && headerFixed;

  const styles = useMemo(() => {
    return {
      height,
      pageStyle: { paddingTop: fixed ? 80 : 0, ...customStyles?.pageStyle },
      headerStyle: {
        padding: "32px 64px 16px 64px",
        ...customStyles?.headerStyle,
      },
      bodyStyle: { padding: 16, ...customStyles?.bodyStyle },
      scrollHeader: customStyles?.scrollHeader,
    };
  }, [customStyles, fixed, height]);

  const logo = (
    <Column justify="center">
      <Link href="/">
        <Image
          css={Logo}
          alt="Eco Logo"
          width={80}
          height={30}
          src={EcoLogoImg}
        />
      </Link>
    </Column>
  );

  const menu = (
    <Column justify="center" onClick={() => setShowNav(true)}>
      <Image css={Logo} alt="Eco Logo" width={80} height={30} src={Menu} />
    </Column>
  );

  const headerStyle = function () {
    if (window.innerWidth < 500) {
      return {
        padding: "16px 0px 16px 16px",
        display: "flex",
        alignItems: "center",
      };
    } else {
      return;
    }
  };

  const NavContainer = styled.div({
    width: "100%",
    background: "rgba(0, 0, 0, 0.9)",
    padding: "32px 24px",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "20",
  });

  const NavHeader = styled.div({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

  const Divider = styled.div({
    width: "100%",
    borderTop: "1px solid #fff",
    marginTop: "24px",
  });

  const TextContainer = styled.div({
    display: "flex",
    alighItems: "center",
  });

  const navStyle = function () {
    if (window.innerWidth < 500) {
      return {
        padding: "28px 20px",
      };
    } else {
      return;
    }
  };

  const navLink = function () {
    if (window.innerWidth < 500) {
      return {
        fontSize: "24px",
      };
    } else {
      return;
    }
  };

  const walletStyle = function () {
    if (window.innerWidth < 500) {
      return {
        background: "#1E1E1E",
        padding: "32px",
        marginTop: "56px",
      };
    } else {
      return;
    }
  };

  const textStyle = function () {
    if (window.innerWidth < 500) {
      return {
        marginRight: "10px",
      };
    } else {
      return;
    }
  };

  const mobileNav = (
    <NavContainer>
      <NavHeader>
        <Link href="/">
          <Image src={Ecologo} alt="logo" />
        </Link>
        <Image src={Close} alt="close" onClick={() => setShowNav(false)} />
      </NavHeader>
      <Column gap="xxl" style={navStyle()}>
        {links.map((item) => {
          if (!account.isConnected && item.name === "account") return null;
          if (item.external) {
            return (
              <HeaderItem
                key={item.name}
                active={item.name === current}
                href={item.href}
                target="_blank"
                style={navLink()}
              >
                {item.label}
              </HeaderItem>
            );
          }
          return (
            <Link key={item.name} href={item.href}>
              <HeaderItem active={item.name === current} style={navLink()}>
                {item.label}
              </HeaderItem>
            </Link>
          );
        })}
      </Column>
      <Divider />
      <Column gap="xl" style={walletStyle()}>
        <TextContainer>
          <Typography color="white" style={textStyle()}>
            0x830s38•••6cl28cf1
          </Typography>
          <Image src={Copy} alt="copy" />
        </TextContainer>
        <TextContainer>
          <Typography color="white" style={textStyle()}>
            View on Explorer
          </Typography>
          <Image src={Share} alt="share" style={textStyle()} />{" "}
        </TextContainer>
        <TextContainer>
          <Typography color="white" style={textStyle()}>
            ETH
          </Typography>
          <Typography>Network</Typography>
        </TextContainer>
        <Button>Disconnect</Button>
      </Column>
    </NavContainer>
  );

  const header = (
    <HeaderContainer
      css={styles.headerStyle}
      showBg={showBg}
      fixed={fixed}
      style={headerStyle()}
    >
      {logo}
      <Space />
      {window.innerWidth < 500 ? (
        menu
      ) : (
        <Row gap="xxl" items="center">
          {links.map((item) => {
            if (!account.isConnected && item.name === "account") return null;
            if (item.external) {
              return (
                <HeaderItem
                  key={item.name}
                  active={item.name === current}
                  href={item.href}
                  target="_blank"
                >
                  {item.label}
                </HeaderItem>
              );
            }
            return (
              <Link key={item.name} href={item.href}>
                <HeaderItem active={item.name === current}>
                  {item.label}
                </HeaderItem>
              </Link>
            );
          })}
          <WalletItem />
        </Row>
      )}
      {showNav && mobileNav}
    </HeaderContainer>
  );

  const overlayHeader =
    scrollHeader && showBg ? (
      <HeaderContainer
        fixed
        css={styles.headerStyle}
        style={styles.scrollHeader}
        display={showBg}
        showBg={showBg}
      >
        <div style={{ position: "fixed", marginTop: 8 }}>{logo}</div>
        {scrollHeader}
      </HeaderContainer>
    ) : null;

  if (content) {
    return (
      <React.Fragment>
        <TopContent
          ref={topRef}
          css={styles.pageStyle}
          style={{ minHeight: styles.height }}
        >
          {header}
          {overlayHeader}
          {content}
        </TopContent>
        <BottomContent css={styles.bodyStyle}>{children}</BottomContent>
      </React.Fragment>
    );
  }

  return (
    <PageContainer ref={topRef} height={styles.height} style={styles.pageStyle}>
      {header}
      {overlayHeader}
      <BodyContainer css={styles.bodyStyle}>{children}</BodyContainer>
    </PageContainer>
  );
};
