import React from "react";

import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";

export default function Payment_Customer_Name_View() {
  return (
    <SafeArea background_color="#FFFFFF">
      <Go_Back_Header label="Card holder name" />
    </SafeArea>
  );
}
