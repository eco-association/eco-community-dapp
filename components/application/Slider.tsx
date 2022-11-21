import React from "react";
import styled from "@emotion/styled";
import ReactSlider, { ReactSliderProps } from "react-slider";

interface SliderProps extends ReactSliderProps {
  value: number;
  maxValue: number;
}

interface TrackProps {
  index: number;
}

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 4px;
`;
const StyledThumb = styled.div`
  height: 16px;
  line-height: 4px;
  width: 16px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  margin-top: -6px;
`;

const Thumb = (props) => <StyledThumb {...props} />;

const StyledTrack = styled.div<TrackProps>`
  top: 0;
  bottom: 0;
  background: ${(props) =>
    props.index === 2 ? "#5AE4BF;" : props.index === 1 ? "#ddd" : "#5AE4BF"};
  border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const Slider: React.FC<SliderProps> = ({ value, maxValue, ...props }) => {
  return (
    <StyledSlider
      renderTrack={Track}
      renderThumb={Thumb}
      min={0}
      max={maxValue}
      value={value}
      {...props}
    />
  );
};

export default Slider;
