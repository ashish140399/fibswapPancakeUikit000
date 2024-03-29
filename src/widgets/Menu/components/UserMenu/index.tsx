import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import MenuIcon from "./MenuIcon";
import { UserMenuItem } from "./styles";

export const StyledUserMenu = styled(Flex)`
align-items: center;
background: linear-gradient(45deg, rgba(55, 150, 229, 0.1) 0%, rgba(70, 236, 227, 0.1) 100%);
  border-radius: 8px;
// box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
cursor: pointer;
display: inline-flex;
height: auto;
padding: 10px 24px;
font-size:14px;
position: relative;
color:#fff !important;
&:hover {
  opacity: 0.65;
}
`;

export const LabelText = styled.div`
color: #fff;
display: none;
font-weight: 600;

${({ theme }) => theme.mediaQueries.sm} {
  display: block;
  margin-left: 8px;
  margin-right: 4px;
}
`;

const Menu = styled.div<{ isOpen: boolean }>`
background: linear-gradient(161.19deg,#0c55ab -.1%,#051d46 105.99%);
// border: 1px solid ${({ theme }) => theme.colors.cardBorder};
border-radius: 16px;
padding-bottom: 4px;
padding-top: 4px;
pointer-events: auto;
width: 280px;
visibility: visible;
z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  variant = variants.DEFAULT,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        onTouchStart={() => {
          setIsOpen((s) => !s);
        }}
      >
        {/* <MenuIcon avatarSrc={avatarSrc} variant={variant} /> */}
        <LabelText title={text || account}>{text || accountEllipsis}</LabelText>
        <ChevronDownIcon color="text" width="24px" />
      </StyledUserMenu>
      <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
        <Box onClick={() => setIsOpen(false)}>{children}</Box>
      </Menu>
    </Flex>
  );
};

export default UserMenu;
