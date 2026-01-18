import styled from "styled-components/native";
import { theme } from "../../infrastructure/theme";

const defaultTextStyles = (theme) => `
  font-family: ${theme.fonts.dmSansRegular};
  color: ${theme.colors.text.black};
 
`;
// ************* Cormorant VARIANTS **************** //
const cormorant_regular_36 = (theme) => `
font-size: ${theme.fontSizes.text_32};
font-family: ${theme.fonts.cormorantRegular};
color: ${theme.colors.brand.primary};
`;
const cormorant_bold_32_italic = (theme) => `
font-size: ${theme.fontSizes.text_32};
font-family: ${theme.fonts.cormorantSemiBoldItalic};
color: ${theme.colors.brand.primary};
`;
// ************* DM SANS VARIANTS **************** //
const dm_sans_bold_40 = (theme) => `
font-size: ${theme.fontSizes.text_40};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_40_white = (theme) => `
font-size: ${theme.fontSizes.text_40};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;
const dm_sans_semiBold_32 = (theme) => `
font-size: ${theme.fontSizes.text_32};
font-family: ${theme.fonts.dmSansSemiBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_32 = (theme) => `
font-size: ${theme.fontSizes.text_32};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_32_white = (theme) => `
font-size: ${theme.fontSizes.text_32};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;
const dm_sans_bold_28 = (theme) => `
font-size: ${theme.fontSizes.text_28};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_Semi_bold_28 = (theme) => `
font-size: ${theme.fontSizes.text_28};
font-family: ${theme.fonts.dmSansSemiBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_26 = (theme) => `
font-size: ${theme.fontSizes.text_26};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;

const dm_sans_bold_24 = (theme) => `
font-size: ${theme.fontSizes.text_24};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};    
`;
const dm_sans_bold_24_white = (theme) => `
font-size: ${theme.fontSizes.text_24};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};    
    `;

const dm_sans_bold_22 = (theme) => `
font-size: ${theme.fontSizes.text_22};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_20 = (theme) => `
font-size: ${theme.fontSizes.text_20};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_regular_20 = (theme) => `
font-size: ${theme.fontSizes.text_20};
font-family: ${theme.fonts.dmSansRegular};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_20_white = (theme) => `
font-size: ${theme.fontSizes.text_20};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;
const dm_sans_bold_20_underlined = (theme) => `
font-size: ${theme.fontSizes.text_20};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
text-decoration: underline;
`;

const dm_sans_bold_18 = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_18_red = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.error};
`;

const dm_sans_regular_18 = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.dmSansRegular};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_18_white = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;

const dm_sans_bold_16 = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_semiBold_16 = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.dmSansSemiBold};
color: ${theme.colors.text.black};
`;

const dm_sans_bold_16_white = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;
const dm_sans_bold_16_cta_disabled = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.not_active};
`;

const dm_sans_regular_16 = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.dmSansRegular};
color: ${theme.colors.text.black};
`;

const dm_sans_bold_14 = (theme) => `
font-size: ${theme.fontSizes.text_14};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_14_error = (theme) => `
font-size: ${theme.fontSizes.text_14};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.error};
`;
const dm_sans_regular_14 = (theme) => `
font-size: ${theme.fontSizes.text_14};
font-family: ${theme.fonts.dmSansRegular};
color: ${theme.colors.text.black};
`;
const dm_sans_bold_14_white = (theme) => `
font-size: ${theme.fontSizes.text_14};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;

const dm_sans_bold_12 = (theme) => `
font-size: ${theme.fontSizes.text_12};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;

const dm_sans_bold_12_white = (theme) => `
font-size: ${theme.fontSizes.text_12};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;
const dm_sans_bold_10 = (theme) => `
font-size: ${theme.fontSizes.text_10};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.black};
`;

const dm_sans_bold_10_white = (theme) => `
font-size: ${theme.fontSizes.text_10};
font-family: ${theme.fonts.dmSansBold};
color: ${theme.colors.text.white};
`;

// ************* RALEWAY VARIANTS **************** //

const raleway_bold_24 = (theme) => `
font-size: ${theme.fontSizes.text_24};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.black};
`;
const raleway_bold_24_white = (theme) => `
font-size: ${theme.fontSizes.text_24};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;
const raleway_bold_20 = (theme) => `
font-size: ${theme.fontSizes.text_20};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.black};
`;
const raleway_bold_20_white = (theme) => `
font-size: ${theme.fontSizes.text_20};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;
const raleway_bold_18 = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.black};
`;
const raleway_bold_18_white = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;
const raleway_medium_18 = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.ralewayMedium};
color: ${theme.colors.text.black};
`;
const raleway_medium_18_white = (theme) => `
font-size: ${theme.fontSizes.text_18};
font-family: ${theme.fonts.ralewayMedium};
color: ${theme.colors.text.white};
`;
const raleway_bold_16 = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.black};
`;
const raleway_medium_16 = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.ralewayMedium};
color: ${theme.colors.text.black};
`;
const raleway_bold_16_white = (theme) => `
font-size: ${theme.fontSizes.text_16};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;
const raleway_bold_14 = (theme) => `
font-size: ${theme.fontSizes.text_14};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.black};
`;
const raleway_bold_14_white = (theme) => `
font-size: ${theme.fontSizes.text_14};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;
const raleway_bold_12_white = (theme) => `
font-size: ${theme.fontSizes.text_12};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;
const raleway_bold_10 = (theme) => `
font-size: ${theme.fontSizes.text_10};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.black};
`;
const raleway_bold_10_white = (theme) => `
font-size: ${theme.fontSizes.text_10};
font-family: ${theme.fonts.ralewayBold};
color: ${theme.colors.text.white};
`;

const variants = {
  cormorant_bold_32_italic,
  // *************************
  dm_sans_bold_40,
  dm_sans_bold_40_white,
  dm_sans_bold_32,
  dm_sans_semiBold_32,
  dm_sans_bold_32_white,
  dm_sans_bold_28,
  dm_sans_Semi_bold_28,
  dm_sans_bold_26,
  dm_sans_bold_24,
  dm_sans_bold_24_white,
  dm_sans_bold_22,
  dm_sans_bold_20,
  dm_sans_bold_20_underlined,
  dm_sans_regular_20,
  dm_sans_bold_20_white,
  dm_sans_bold_18,
  dm_sans_regular_18,
  dm_sans_bold_18_white,
  dm_sans_bold_18_red,
  dm_sans_bold_16,
  dm_sans_semiBold_16,
  dm_sans_regular_16,
  dm_sans_bold_16_white,
  dm_sans_bold_16_cta_disabled,
  dm_sans_bold_14,
  dm_sans_bold_14_error,
  dm_sans_bold_14_white,
  dm_sans_regular_14,
  dm_sans_bold_12,
  dm_sans_bold_12_white,
  dm_sans_bold_10,
  dm_sans_bold_10_white,
  //*************************
  raleway_bold_24,
  raleway_bold_24_white,
  raleway_bold_20,
  raleway_bold_20_white,
  raleway_bold_18,
  raleway_bold_18_white,
  raleway_medium_18,
  raleway_medium_18_white,
  raleway_bold_16,
  raleway_bold_16_white,
  raleway_medium_16,
  raleway_bold_14,
  raleway_bold_14_white,
  raleway_bold_12_white,
  raleway_bold_10,
  raleway_bold_10_white,
};

export const Text = styled.Text`
  ${({ theme }) => defaultTextStyles(theme)}
  ${({ variant, theme }) => variants[variant](theme)}
`;

Text.defaultProps = {
  variant: "body",
};
