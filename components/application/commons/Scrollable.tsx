import { styled } from "@ecoinc/ecomponents";
import { breakpoints, mq } from "../../../utilities";

export const Scrollable = styled.div`
  ${mq(breakpoints.md)} {
    overflow: scroll;
    max-height: 500px;
  }

  ::-webkit-scrollbar {
    background: white;
    width: 9px;
    height: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: #dce9f0;
    border-radius: 43px;
  }

  scrollbar-color: #dce9f0 white;
`;
