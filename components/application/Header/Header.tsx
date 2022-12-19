import React, { CSSProperties, useMemo, useRef } from "react";
import { Column, Row, styled } from "@ecoinc/ecomponents";
import Image from "next/image";
import EcoLogoImg from "../../../public/images/eco-gov-logo.svg";
import { useScrollExceeds } from "../../hooks/useScrollExceeds";
import { HeaderItem } from "./HeaderItem";
import { WalletItem } from "./WalletItem";
import Link from "next/link";
import { useAccount } from "wagmi";
import { css } from "@emotion/react";
import HeaderBackground from "./HeaderBackground";

const PageContainer = styled.div<{ height: number }>(({ theme, height }) => ({
  backgroundRepeat: "no-repeat",
  backgroundSize: [`auto ${height}px`, `100% ${height}px`, "auto"].join(", "),
  backgroundPosition: "top center",
  minHeight: "100vh",
}));

const TopContent = styled.div(({ theme }) => ({
  backgroundRepeat: "no-repeat",
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

  const header = (
    <HeaderContainer css={styles.headerStyle} showBg={showBg} fixed={fixed}>
      {logo}
      <Space />
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
        <HeaderBackground styles={styles}>
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
        </HeaderBackground>
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
