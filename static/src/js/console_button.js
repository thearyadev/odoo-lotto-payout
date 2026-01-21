/** @odoo-module **/

import { Component } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";

const LOTTO_INTERNAL_REF = "LOTTO_PAYOUT";

export class ConsoleLogButton extends Component {
    static template = "console_log_button.ConsoleLogButton";

    setup() {
        this.pos = usePos();
        this.dialog = useService("dialog");
    }

    async onClick() {
        // Find product by internal reference (default_code)
        const products = this.pos.models['product.product'].getAll();
        const matchingProducts = products.filter(p => p.default_code === LOTTO_INTERNAL_REF);

        if (matchingProducts.length === 0) {
            alert("Lotto Payout product not found. Please set a product's Internal Reference to: " + LOTTO_INTERNAL_REF);
            return;
        }

        if (matchingProducts.length > 1) {
            alert("Multiple products found with Internal Reference '" + LOTTO_INTERNAL_REF + "'. Please ensure only one product has this reference.");
            return;
        }

        const product = matchingProducts[0];

        this.dialog.add(NumberPopup, {
            title: "Lotto Payout Amount",
            startingValue: 0,
            getPayload: (value) => {
                const amount = parseFloat(value);
                if (isNaN(amount) || amount <= 0) {
                    alert("Please enter a valid payout amount");
                    return;
                }

                this.pos.addLineToCurrentOrder({ product_id: product }, {});
                const order = this.pos.get_order();
                const line = order.get_selected_orderline();
                if (line) {
                    line.set_unit_price(-amount);
                }

                console.log("Lotto payout added:", amount);
            },
        });
    }
}

// Patch ControlButtons to include our component
patch(ControlButtons, {
    components: {
        ...ControlButtons.components,
        ConsoleLogButton,
    },
});

console.log("LottoPayout button loaded!");
