/** @odoo-module **/

import { useModelField } from "@web/core/model_field_selector/model_field_hook";
import { ModelFieldSelector } from "@web/core/model_field_selector/model_field_selector";
import { registry } from "@web/core/registry";
import { DomainSelectorControlPanel } from "@web/core/domain_selector/domain_selector_control_panel";
import { DomainSelectorDefaultField } from "@web/core/domain_selector/fields/domain_selector_default_field";
import { Component, onWillStart, onWillUpdateProps, useRef, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { _lt } from "@web/core/l10n/translation";
export class DomainSelectorLeafNodeParam extends Component {
    setup() {
        this.root = useRef("root");
        this.modelField = useModelField();
        this.fieldInfo = {
            type: "integer",
            string: "ID",
        };
        this.notification = useService("notification");
        onWillStart(async () => {
            this.fieldInfo = await this.loadField(this.props.resModel, this.props.node.operands[0]);
        });
        onWillUpdateProps(async (nextProps) => {
            this.fieldInfo = await this.loadField(nextProps.resModel, nextProps.node.operands[0]);
        });
    }
    get displayedOperator() {
        const op = this.getOperatorInfo(this.props.node.operator);
        return op ? op.label : "?";
    }
    get isValueHidden() {
        const op = this.getOperatorInfo(this.props.node.operator);
        return op ? op.hideValue : false;
    }
    async loadField(resModel, fieldName) {
        const chain = await this.modelField.loadChain(resModel, fieldName);
        if (!chain[chain.length - 1].field && chain.length > 1) {
            return chain[chain.length - 2].field;
        }
        return (
            chain[chain.length - 1].field || {
                type: "integer",
                string: "ID",
            }
        );
    }
    findOperator(operatorList, opToFind) {
        return operatorList.find((o) =>
            o.matches({
                field: this.fieldInfo,
                value: this.props.node.operands[1],
                operator: opToFind,
            })
        );
    }
    getOperators(field, fieldInfo) {
        const operatorParam = "value"
        const operators = this.getFieldComponent(fieldInfo.type, operatorParam).getOperators();
        if (this.findOperator(operators, this.props.node.operator)) {
            return operators;
        }
        return operators.concat(
            this.findOperator(
                registry.category("domain_selector/operator").getAll(),
                this.props.node.operator
            )
        );
    }
    getFieldComponent(type, operatorParam) {
        if (operatorParam === undefined) {
            var value_split = ("" + this.props.node.operands[1]).split(/\(([^)]+)\)/);
            var param = value_split[0] === 'param' ? true : false;
            if (param === true){
                this.props.selectionParam = this.getSelectionParam();
                this.props.operatorParam = "param";
                return registry.category("domain_selector/fields").get("selectionParam", DomainSelectorDefaultField);
            }
            else
            {
                return registry.category("domain_selector/fields").get(type, DomainSelectorDefaultField);
            }
        }
        else{
            if (operatorParam === "param"){
                this.props.selectionParam = this.getSelectionParam();
                this.props.operatorParam = "param";
                return registry.category("domain_selector/fields").get("selectionParam", DomainSelectorDefaultField);
            }
            else
            {
                return registry.category("domain_selector/fields").get(type, DomainSelectorDefaultField);
            }
        }
    }
    getOperatorInfo(operator) {
        const operatorParam = "value"
        const op = this.findOperator(
            this.getFieldComponent(this.fieldInfo.type, operatorParam).getOperators(),
            operator
        );
        if (op) {
            return op;
        }
        return this.findOperator(
            registry.category("domain_selector/operator").getAll(),
            this.props.node.operator
        );
    }
    async onFieldChange(fieldName) {
        this.props.node.operands[1] = "";
        const changes = { fieldName };
        const fieldInfo = await this.loadField(this.props.resModel, fieldName);
        const component = this.getFieldComponent(fieldInfo.type);
        Object.assign(changes, component.onDidTypeChange(fieldInfo));
        this.props.node.update(changes);
    }
    onOperatorChange(ev) {
        const operatorParam = "value"
        const component = this.getFieldComponent(this.fieldInfo.type, operatorParam);
        const operatorInfo = component.getOperators()[parseInt(ev.target.value, 10)];
        const changes = { operator: operatorInfo.value };
        Object.assign(
            changes,
            operatorInfo.onDidChange(this.getOperatorInfo(this.props.node.operator), () =>
                component.onDidTypeChange(this.fieldInfo)
            )
        );
        this.props.node.update(changes);
    }
    getSelectionParam() {
        const reportParams = this.props.reportParams;
        const type = this.fieldInfo.type;
        const relation = this.fieldInfo.relation;
	        var params_arr = new Array();
	        var params_arr_all = new Array();
	        var params_all =  ("" + reportParams).split(';');
	        var i_split = ''
	    	var n = 0
	    	for (var i = 1 ; i < params_all.length ; i++) {
	    		i_split = ("" + params_all[i-1]).split(',');
	        	params_arr_all[i-1] = i_split
	        	var type_param_char = ['char', 'text', 'html', 'selection', 'reference']
	        	var type_param_integer = ['integer']
	        	var type_param_float = ['float', 'monetary']
	        	var type_param_m2x = ['many2one','one2many', 'many2many']
	        	var type_param_date = ['date']
	        	var type_param_datetime = ['datetime']
	        	var type_param_boolean = ['boolean']
	        	if ((_.contains(type_param_char, i_split[2])) && (_.contains(type_param_char, type))) {
	        		params_arr[n] = [i_split[0],i_split[1]];
	        		n++;
	        	} else if ((_.contains(type_param_integer, i_split[2])) && (_.contains(type_param_integer, type))) {
	        		params_arr[n] = [i_split[0],i_split[1]];
	        		n++;
	        	} else if ((_.contains(type_param_float, i_split[2])) && (_.contains(type_param_float, type))) {
	        		params_arr[n] = [i_split[0],i_split[1]];
	        		n++;
	        	} else if ((_.contains(type_param_m2x, i_split[2])) && (_.contains(type_param_m2x, type))) {
	        		if (_.contains([relation], i_split[3])){
	            		params_arr[n] = [i_split[0],i_split[1]];
	            		n++;
	        		}
	        	} else if ((_.contains(type_param_date, i_split[2])) && (_.contains(type_param_date, type))) {
	        		params_arr[n] = [i_split[0],i_split[1]];
	        		n++;
	        	} else if ((_.contains(type_param_datetime, i_split[2])) && (_.contains(type_param_datetime, type))) {
	        		params_arr[n] = [i_split[0],i_split[1]];
	        		n++;
	        	} else if ((_.contains(type_param_boolean, i_split[2])) && (_.contains(type_param_boolean, type))) {
	        		params_arr[n] = [i_split[0],i_split[1]];
	        		n++;
	        	}
            }
            return params_arr;
    }
    onOperatorChangeParam(ev) {
        this.props.operatorParam = ev.target.value;
        const component = this.getFieldComponent(this.fieldInfo.type, this.props.operatorParam);
        const changes = { operatorParam: this.props.operatorParam };
        if (this.props.operatorParam == "param"){
            if (this.props.selectionParam.length > 0){
                Object.assign(changes, component.onDidOperatorParamChange(this.fieldInfo, this.props.selectionParam));
                this.props.node.update(changes);
            }
            else{
                this.props.operatorParam = "value";
                ev.target.value = this.props.operatorParam;
                let message = '';
                    if (_.contains(['many2one','one2many', 'many2many'], this.fieldInfo.type)){
                        message =  _lt('Report Parameters with Relation Model:\"' + this.fieldInfo.relation + '\" Not Found!  ATTENTION! MODIFIED OR NEW CREATED PARAMETERS WILL BE AVAILABLE FOR CHOICE IN THE DOMAIN ONLY AFTER YOU SAVE A REPORT!');
                    }
                    else if (_.contains(['selection'], this.fieldInfo.type)){
                        message =  _lt('Report Parameters with Type: \"' + 'char' + '\" Not Found!  \
                        Due to API restrictions, for a Field of Type "selection", it is possible to use only a Parameter of Type "char".\
                        ATTENTION! MODIFIED OR NEW CREATED PARAMETERS WILL BE AVAILABLE FOR CHOICE IN THE DOMAIN ONLY AFTER YOU SAVE A REPORT!');
                    }
                    else{
                        message =  _lt('Report Parameters with Type: \"' + this.fieldInfo.type + '\" Not Found!  ATTENTION! MODIFIED OR NEW CREATED PARAMETERS WILL BE AVAILABLE FOR CHOICE IN THE DOMAIN ONLY AFTER YOU SAVE A REPORT!');
                    }
                    this.notification.add(
                        message,
                        { type: "warning" },
                        );
            };
        }
        else {
            Object.assign(changes, component.onDidTypeChange(this.fieldInfo));
            this.props.node.update(changes);
        }
    }
    onHoverDeleteNodeBtn(hovering) {
        this.root.el.classList.toggle("o_hover_btns", hovering);
    }
    onHoverInsertLeafNodeBtn(hovering) {
        this.root.el.classList.toggle("o_hover_add_node", hovering);
    }
    onHoverInsertBranchNodeBtn(hovering) {
        this.root.el.classList.toggle("o_hover_add_node", hovering);
        this.root.el.classList.toggle("o_hover_add_inset_node", hovering);
    }
}
Object.assign(DomainSelectorLeafNodeParam, {
    template: "reports_designer.DomainSelectorLeafNodeParam",
    components: {
        DomainSelectorControlPanel,
        ModelFieldSelector,
    },
});
