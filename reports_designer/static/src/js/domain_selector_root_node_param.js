/** @odoo-module **/

import { DomainSelectorBranchNodeParam } from "./domain_selector_branch_node_param";
import { DomainSelectorBranchOperator } from "@web/core/domain_selector/domain_selector_branch_operator";
import { DomainSelectorLeafNodeParam } from "./domain_selector_leaf_node_param";
import { Component } from "@odoo/owl";
export class DomainSelectorRootNodeParam extends Component {
    get hasNode() {
        return this.props.node.operands.length > 0;
    }
    get node() {
        return this.props.node.operands[0];
    }
    insertNode(newNodeType) {
        this.props.node.insert(newNodeType);
    }
    onOperatorSelected(ev) {
        this.props.node.update(ev.detail.payload.operator);
    }
    onChange(ev) {
        this.props.node.update(ev.target.value, true);
    }
}
DomainSelectorRootNodeParam.template = "reports_designer.DomainSelectorRootNodeParam";
DomainSelectorRootNodeParam.components = {
    DomainSelectorBranchNodeParam,
    DomainSelectorBranchOperator,
    DomainSelectorLeafNodeParam,
};
