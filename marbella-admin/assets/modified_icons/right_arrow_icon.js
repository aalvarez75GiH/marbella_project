import Svg, { Path } from "react-native-svg";

export const RightArrowIcon = ({
  width = 10,
  height = 17,
  color = "#898989",
}) => (
  <Svg width={width} height={height} viewBox="0 0 10 17" fill="none">
    <Path
      d="M1 16L8.5 8.5L1 1"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
