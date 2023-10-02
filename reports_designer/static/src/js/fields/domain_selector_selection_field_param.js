/** @odoo-module **/

import { evaluateExpr } from "@web/core/py_js/py";
import { formatAST, toPyValue } from "@web/core/py_js/py_utils";
import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";
const dsf = registry.category("domain_selector/fields");
const dso = registry.category("domain_selector/operator");
export class DomainSelectorSelectionFieldParam extends Component {
    get options() {
        return [
            [false, ""],
            ...this.props.selectionParam.selection.filter((option) => !this.props.value.includes(option[0])),
        ];
    }
    get formattedValue() {
        const ast = toPyValue(this.props.value);
        return formatAST(ast);
    }
    onChange(ev) {
        this.props.update({ value: ev.target.value });
    }
    onChangeMulti(ev) {
        this.props.update({ value: evaluateExpr(ev.target.value) });
    }
}
Object.assign(DomainSelectorSelectionFieldParam, {
    template: "reports_designer.DomainSelectorSelectionFieldParam",
    onDidTypeChange(field) {
        return { value: field.selection[0][0] };
    },
    onDidOperatorParamChange(field, selectionParams) {
            return { value: selectionParams[0][0] };
    },
    onDidOperatorParamChangeEmpty(field, selectionParams) {
            return { value: selectionParams };
    },
    getOperators() {
        return ["=", "!=", "set", "not set"].map((key) => dso.get(key));
    },
});
dsf.add("selectionParam", DomainSelectorSelectionFieldParam);
