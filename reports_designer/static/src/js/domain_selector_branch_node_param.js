/** @odoo-module **/

import { DomainSelectorBranchOperator } from "@web/core/domain_selector/domain_selector_branch_operator";
import { DomainSelectorControlPanel } from "@web/core/domain_selector/domain_selector_control_panel";
import { DomainSelectorLeafNodeParam } from "./domain_selector_leaf_node_param";
import { Component, useRef } from "@odoo/owl";
export class DomainSelectorBranchNodeParam extends Component {
    setup() {
        this.root = useRef("root");
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
DomainSelectorBranchNodeParam.template = "reports_designer.DomainSelectorBranchNodeParam";
DomainSelectorBranchNodeParam.components = {
    DomainSelectorBranchNodeParam,
    DomainSelectorBranchOperator,
    DomainSelectorControlPanel,
    DomainSelectorLeafNodeParam,
};
