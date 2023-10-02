/** @odoo-module **/

import { DomainSelectorParam } from "./domain_selector_param";
import { DomainSelectorDialogParam } from "./domain_selector_dialog_param";
import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useBus, useService, useOwnedDialogs } from "@web/core/utils/hooks";
import { Domain } from "@web/core/domain";
import { SelectCreateDialog } from "@web/views/view_dialogs/select_create_dialog";
import { standardFieldProps } from "./report_model_field_selector/standard_field_props";
import { Component, onWillStart, onWillUpdateProps, useState } from "@odoo/owl";
const type_mapping = {
    "char": "",
    "integer": 0,
    "float": 0.0,
    "many2one": "",
    "many2many": "",
    "date": "2000-01-01",
    "datetime": "2000-01-01 12:39:55",
    "boolean": false,
};
export class DomainFieldParam extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({
            recordCount: null,
            isValid: true,
        });
        this.addDialog = useOwnedDialogs();
        this.displayedDomain = null;
        this.isDebugEdited = false;
        onWillStart(() => {
            this.displayedDomain = this.props.value;
            this.loadCount(this.props);
            this.props.reportParams = this.props.record.data.reports_designer_param_content;
        });
        onWillUpdateProps((nextProps) => {
            this.props.reportParams = this.props.record.data.reports_designer_param_content;
            this.isDebugEdited = this.isDebugEdited && this.props.readonly === nextProps.readonly;
            if (!this.isDebugEdited) {
                this.displayedDomain = nextProps.value;
                this.loadCount(nextProps);
            }
        });
        useBus(this.env.bus, "RELATIONAL_MODEL:NEED_LOCAL_CHANGES", async (ev) => {
            if (this.isDebugEdited) {
                const prom = this.loadCount(this.props);
                ev.detail.proms.push(prom);
                await prom;
                if (!this.state.isValid) {
                    this.props.record.setInvalidField(this.props.name);
                }
            }
        });
    }
    getContext(p) {
        return p.record.getFieldContext(p.name);
    }
    getResModel(p) {
        let resModel = p.resModel;
        if (p.record.fieldNames.includes(resModel)) {
            resModel = p.record.data[resModel];
        }
        return resModel;
    }
    onButtonClick() {
        this.addDialog(SelectCreateDialog, {
            title: this.env._t("Selected records"),
            noCreate: true,
            multiSelect: false,
            resModel: this.getResModel(this.props),
            domain: this.getDomain(this.props.value).toList(this.getContext(this.props)) || [],
            context: this.getContext(this.props) || {},
        }, {
            onClose: () => this.loadCount(this.props)
        });
    }
    get isValidDomain() {
        try {
            this.getDomain(this.props.value).toList();
            return true;
        } catch (_e) {
            return false;
        }
    }
    getDomain(value) {
        this.props.reportParams = this.props.record.data.reports_designer_param_content;
        return new Domain(value || "[]");
    }
    async loadCount(props) {
        if (!this.getResModel(props)) {
            Object.assign(this.state, { recordCount: 0, isValid: true });
        }
        let recordCount;
        try {
            var domainValueArr = this.getDomain(props.value).toList(this.getContext(props));
            var params_arr_all = new Array();
            var params_all =  ("" + props.record.data.reports_designer_param_content).split(';');
            var i_split = ''
            var n = 0
            for (var i = 1 ; i < params_all.length ; i++) {
                i_split = ("" + params_all[i-1]).split(',');
                params_arr_all[i-1] = i_split
            }
        for (var i = 1 ; i <= domainValueArr.length ; i++) {
            if (domainValueArr[i-1] instanceof Array){
                var value_split = ("" + domainValueArr[i-1][2]).split(/\(([^)]+)\)/);
                var param = value_split[0] === 'param' ? true : false;
                if (param){
                    let check_param = false;
                    for (var k in params_arr_all) {
                        if ( params_arr_all[k][0] == domainValueArr[i-1][2]) {
                            domainValueArr[i-1][1] = "=";
                            domainValueArr[i-1][2] = type_mapping[params_arr_all[k][2]];
                            check_param = true;
                        }
                    }
                    if (!check_param){
                        Object.assign(this.state, { recordCount: 0, isValid: false });
                        return;
                    }
                }
            }
        }
            let domain = domainValueArr;
            recordCount = await this.orm.silent.call(
                this.getResModel(props),
                "search_count",
                [domain],
                { context: this.getContext(props) }
                    );
        } catch (_e) {
            Object.assign(this.state, { recordCount: 0, isValid: false });
            return;
        }
        Object.assign(this.state, { recordCount, isValid: true });
    }
    update(domain, isDebugEdited) {
        this.isDebugEdited = isDebugEdited;
        return this.props.update(domain);
    }
    onEditDialogBtnClick() {
        this.addDialog(DomainSelectorDialogParam, {
            resModel: this.getResModel(this.props),
            initialValue: this.props.value || "[]",
            readonly: this.props.readonly,
            isDebugMode: !!this.env.debug,
            onSelected: this.props.update,
            reportParams: this.props.reportParams || "",
        });
    }
}
DomainFieldParam.template = "reports_designer.DomainFieldParam";
DomainFieldParam.components = {
    DomainSelectorParam,
};
DomainFieldParam.props = {
    ...standardFieldProps,
    editInDialog: { type: Boolean, optional: true },
    resModel: { type: String, optional: true },
    reportParams: { type: String, optional: true },
};
DomainFieldParam.defaultProps = {
    editInDialog: false,
};
DomainFieldParam.displayName = _lt("Domain");
DomainFieldParam.supportedTypes = ["char"];
DomainFieldParam.isEmpty = () => false;
DomainFieldParam.extractProps = ({ attrs }) => {
    return {
        editInDialog: attrs.options.in_dialog,
        resModel: attrs.options.model,
    };
};
registry.category("fields").add("domain_param", DomainFieldParam);
