import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Global_Context_Provider } from "../services/global/global.context";
import { Warehouse_Context_Provider } from "../services/warehouse/warehouse.context";
import { Cart_Context_Provider } from "../services/cart/cart.context";
import { Orders_Context_Provider } from "../services/orders/orders.context";
import { Payments_Context_Provider } from "../services/payments/payments.context";
import { Authentication_Context_Provider } from "../services/authentication/authentication.context";
// import { Geolocation_Context_Provider } from "../services/geolocation/geolocation.context";

export const AppProviders = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Global_Context_Provider>
        {/* <Authentication_Context_Provider> */}
        <Warehouse_Context_Provider>
          <Cart_Context_Provider>
            <Orders_Context_Provider>
              <Payments_Context_Provider>{children}</Payments_Context_Provider>
            </Orders_Context_Provider>
          </Cart_Context_Provider>
        </Warehouse_Context_Provider>
        {/* </Authentication_Context_Provider> */}
      </Global_Context_Provider>
    </GestureHandlerRootView>
  );
};
