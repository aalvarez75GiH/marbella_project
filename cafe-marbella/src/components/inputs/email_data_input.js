import React from "react";
import { TextInput } from "react-native-paper";

import { DataInput } from "./data_text_input";
import { theme } from "../../infrastructure/theme";

export const EmailDataInput = React.forwardRef(
  ({ label, onChangeText, textInputOnPress, value }, ref) => {
    return (
      <DataInput
        ref={ref}
        fontFamily="DMSans-Bold"
        label={label}
        value={value}
        onChangeText={onChangeText}
        border_color={theme.colors.inputs.bottom_lines_disabled}
        underlineColor={theme.colors.inputs.bottom_lines_disabled}
        border_width="0.5px"
        activeUnderlineColor={theme.colors.ui.primary}
        keyboardType="email-address"
        autoCorrect={false}
        returnKeyType="done"
        autoComplete="off"
        textContentType="none"
        autoCapitalize="none"
        spellCheck={false}
        right={
          value ? (
            <TextInput.Icon
              icon="close-circle"
              style={{ marginTop: 30 }}
              size={18}
              color="#A9B2B2"
              onPress={textInputOnPress}
            />
          ) : null
        }
      />
    );
  }
);
