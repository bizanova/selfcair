/** @odoo-module **/

import { Dialog } from "@web/core/dialog/dialog";
import { DomainSelectorParam } from "./domain_selector_param";
import { _t } from "@web/core/l10n/translation";
import { Component, useState } from "@odoo/owl";
export class DomainSelectorDialogParam extends Component {
    setup() {
        this.state = useState({
            value: this.props.initialValue,
        });
    }
    get dialogTitle() {
        return _t("Domain");
    }
    get domainSelectorProps() {
        return {
            className: this.props.className,
            resModel: this.props.resModel,
            readonly: this.props.readonly,
            isDebugMode: this.props.isDebugMode,
            reportParams: this.props.reportParams,
            defaultLeafValue: this.props.defaultLeafValue,
            value: this.state.value,
            update: (value) => {
                this.state.value = value;
            },
        };
    }
    async onSave() {
        await this.props.onSelected(this.state.value);
        this.props.close();
    }
    onDiscard() {
        this.props.close();
    }
}
DomainSelectorDialogParam.template = "reports_designer.DomainSelectorDialogParam";
DomainSelectorDialogParam.components = {
    Dialog,
    DomainSelectorParam,
};
DomainSelectorDialogParam.props = {
    close: Function,
    className: { type: String, optional: true },
    resModel: String,
    readonly: { type: Boolean, optional: true },
    isDebugMode: { type: Boolean, optional: true },
    defaultLeafValue: { type: Array, optional: true },
    initialValue: { type: String, optional: true },
    onSelected: { type: Function, optional: true },
    reportParams: { type: String, optional: true },
};
DomainSelectorDialogParam.defaultProps = {
    initialValue: "",
    onSelected: () => {},
    readonly: true,
    isDebugMode: false,
};
