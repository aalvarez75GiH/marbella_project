import Svg, { Path } from "react-native-svg";

export const CheckIcon = ({ size = 24, color = "#222A30" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Path
        d="M12.8,28.7l-9.5-9.5c-0.4-0.4-0.4-1.1,0-1.6l1.5-1.5c0.4-0.4,1.1-0.4,1.6,0l7.2,7.2l16-16c0.4-0.4,1.1-0.4,1.6,0l1.5,1.5c0.4,0.4,0.4,1.1,0,1.6L14.4,28.7C13.9,29.1,13.2,29.1,12.8,28.7z"
        fill={color}
      />
    </Svg>
  );
};
