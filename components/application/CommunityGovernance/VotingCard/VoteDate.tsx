import { Row, styled } from "@ecoinc/ecomponents";
import React from "react";
import moment from "moment";
import { Countdown } from "../../Countdown";
import { MonoText } from "../../commons/MonoText";
import { GenerationStage } from "../../../../types";

const Pulse = styled.div`
  border-radius: 50%;
  height: 10px;
  width: 10px;
  padding: 2px;
  transform: scale(1);

  background-color: #5ae4bf4c;
  box-shadow: 0 0 0 0 #5ae4bf4c;
  animation: pulse-green 2s infinite;

  ::before {
    content: "";
    display: block;
    border-radius: 50%;
    height: 6px;
    width: 6px;
    background: #5ae4bf;
    box-shadow: 0 0 0 0 #5ae4bf;
  }

  @keyframes pulse-green {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #5ae4bfb2;
    }
    90% {
      transform: scale(1);
      box-shadow: 0 0 0 6px #5ae4bf00;
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #5ae4bf00;
    }
  }
`;

interface VoteCountdownProps {
  stage: GenerationStage;
  date: Date;
}

export const VoteDate: React.FC<VoteCountdownProps> = ({ stage, date }) => {
  if (date.getTime() < Date.now()) {
    const dateText = moment(date).format("hh:mmA MM.DD.YY");
    return (
      <Row gap="md" items="center" css={{ alignSelf: "center" }}>
        <MonoText variant="body3">VOTE PASSED</MonoText>
        <MonoText variant="body3" color="active">
          @{dateText}
        </MonoText>
      </Row>
    );
  }
  if (stage === GenerationStage.Majority) {
    return (
      <Row gap="md" items="center" css={{ alignSelf: "center" }}>
        <Pulse />
        <MonoText variant="body3">VOTE</MonoText>
        <MonoText variant="body3" color="active">
          VOTE MAJORITY REACHED
        </MonoText>
      </Row>
    );
  }
  return (
    <Row gap="md" items="center" css={{ alignSelf: "center" }}>
      <Pulse />
      <MonoText variant="body3">VOTE</MonoText>
      <Countdown date={date} variant="body3" color="active" />
    </Row>
  );
};
