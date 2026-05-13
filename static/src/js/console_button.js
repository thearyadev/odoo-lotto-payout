/** @odoo-module **/

import { Component } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";
import { parseFloat as parseLocalizedFloat } from "@web/views/fields/parsers";

const LOTTO_INTERNAL_REF = "LOTTO_PAYOUT";

function parsePayoutAmount(value) {
    try {
        return parseLocalizedFloat(String(value ?? "").trim());
    } catch {
        return NaN;
    }
}

export class LottoPayoutButton extends Component {
    static template = "odoo_lotto_payout.LottoPayoutButton";

    setup() {
        this.pos = usePos();
        this.dialog = useService("dialog");
    }

    async onClick() {
        const products = this.pos.models["product.product"].getAll();
        const matchingProducts = products.filter(
            (product) => product.default_code === LOTTO_INTERNAL_REF
        );

        if (matchingProducts.length === 0) {
            this.dialog.add(AlertDialog, {
                title: _t("Lotto Payout Product Missing"),
                body: _t(
                    "Set one available POS product's Internal Reference to %s.",
                    LOTTO_INTERNAL_REF
                ),
            });
            return;
        }

        if (matchingProducts.length > 1) {
            this.dialog.add(AlertDialog, {
                title: _t("Multiple Lotto Payout Products"),
                body: _t(
                    "Only one POS product can use Internal Reference %s.",
                    LOTTO_INTERNAL_REF
                ),
            });
            return;
        }

        const product = matchingProducts[0];

        this.dialog.add(NumberPopup, {
            title: _t("Lotto Payout Amount"),
            startingValue: "",
            isValid: (value) => parsePayoutAmount(value) > 0,
            feedback: (value) => {
                if (!value) {
                    return false;
                }
                return parsePayoutAmount(value) > 0
                    ? false
                    : _t("Enter an amount greater than zero.");
            },
            getPayload: async (value) => {
                const amount = parsePayoutAmount(value);
                if (amount > 0) {
                    await this.pos.addLineToCurrentOrder(
                        { product_id: product, price_unit: -amount },
                        {}
                    );
                }
            },
        });
    }
}

// Register the button on ProductScreen so it can be rendered outside the Actions popup.
patch(ProductScreen, {
    components: {
        ...ProductScreen.components,
        LottoPayoutButton,
    },
});
