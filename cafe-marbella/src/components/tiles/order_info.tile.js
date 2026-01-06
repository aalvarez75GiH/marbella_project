import React, { useContext } from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export const Order_Info_Tile = ({
  sub_total,
  shipping,
  taxes,
  discount,
  total,
}) => {
  const { formatCentsToUSD } = useContext(GlobalContext);
  const formatted_currency = formatCentsToUSD;

  return (
    <>
      <Container
        width="100%"
        height="25%"
        //   color={"red"}
        color={theme.colors.bg.elements_bg}
        justify="center"
        align="center"
        direction="row"
        //   padding_vertical="8px"
      >
        <Container
          width="60%"
          height="100%"
          //   color={"purple"}
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="center"
        >
          <Container
            width="100%"
            height="15%"
            // color={"orange"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_18">Items:</Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"red"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_18">Shipping & handling:</Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"lightblue"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_18">Estimated tax:</Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"lightgreen"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_18">Discounts:</Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"pink"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_18">Order total:</Text>
            </Spacer>
          </Container>
        </Container>
        {/* ***************************************** */}
        <Container
          width="40%"
          height="100%"
          //   color={"yellow"}
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="center"
        >
          <Container
            width="100%"
            height="15%"
            //   color={"orange"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-end"
          >
            <Spacer position="right" size="large">
              <Text variant="dm_sans_regular_18">
                {formatted_currency(sub_total)}
              </Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"red"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-end"
          >
            <Spacer position="right" size="large">
              <Text variant="dm_sans_regular_18">
                {formatted_currency(shipping)}
              </Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"lightblue"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-end"
          >
            <Spacer position="right" size="large">
              <Text variant="dm_sans_regular_18">
                {formatted_currency(taxes)}
              </Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"lightgreen"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-end"
          >
            <Spacer position="right" size="large">
              <Text variant="dm_sans_regular_18">
                -{formatted_currency(discount)}
              </Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="15%"
            // color={"pink"}
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-end"
          >
            <Spacer position="right" size="large">
              <Text variant="dm_sans_bold_18">{formatted_currency(total)}</Text>
            </Spacer>
          </Container>
        </Container>
      </Container>
    </>
  );
};
