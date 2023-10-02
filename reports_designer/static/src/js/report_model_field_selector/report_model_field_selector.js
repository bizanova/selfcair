/** @odoo-module **/

//import { useModelField } from "@web/core/model_field_selector/model_field_hook";
//import { useUniquePopover } from "@web/core/model_field_selector/unique_popover_hook";
//import { ReportModelFieldSelectorPopover } from "./report_model_field_selector_popover";
//import { registry } from "@web/core/registry";
//import { Component, onWillStart, onWillUpdateProps } from "@odoo/owl";
//import { standardFieldProps } from "./standard_field_props";
//export class ReportModelFieldSelector extends Component {
//    setup() {
//        this.popover = useUniquePopover();
//        this.modelField = useModelField();
//        this.chain = [];
//        onWillStart(async () => {
//            this.props.fieldName = this.props.value;
//            this.props.resModel = this.getResModel(this.props);
//            this.chain = await this.loadChain(this.props.resModel, this.props.fieldName);
//        });
//        onWillUpdateProps(async (nextProps) => {
//            nextProps.fieldName = nextProps.value;
//            nextProps.resModel = this.getResModel(nextProps);
//            this.chain = await this.loadChain(nextProps.resModel, nextProps.fieldName);
//        });
//    }
//    getContext(p) {
//        return p.record.getFieldContext(p.name);
//    }
//    getResModel(p) {
//        let resModel = p.resModel;
//        if (p.record.fieldNames.includes(resModel)) {
//            resModel = p.record.data[resModel];
//        }
//        return resModel;
//    }
//    get fieldNameChain() {
//        return this.getFieldNameChain(this.props.fieldName);
//    }
//    getFieldNameChain(fieldName) {
//        return fieldName.length ? fieldName.split(".") : [];
//    }
//    async loadChain(resModel, fieldName) {
//        if ("01".includes(fieldName)) {
//            return [{ resModel, field: { string: fieldName } }];
//        }
//        const fieldNameChain = this.getFieldNameChain(fieldName);
//        let currentNode = {
//            resModel,
//            field: null,
//        };
//        const chain = [currentNode];
//        for (const fieldName of fieldNameChain) {
//            const fieldsInfo = await this.modelField.loadModelFields(currentNode.resModel);
//            Object.assign(currentNode, {
//                field: { ...fieldsInfo[fieldName], name: fieldName },
//            });
//            if (fieldsInfo[fieldName].relation) {
//                currentNode = {
//                    resModel: fieldsInfo[fieldName].relation,
//                    field: null,
//                };
//                chain.push(currentNode);
//            }
//        }
//        return chain;
//    }
//    update(chain) {
//        this.props.update(chain.join("."));
//    }
//    onFieldSelectorClick(ev) {
//        if (this.props.readonly) {
//            return;
//        }
//        this.popover.add(
//            ev.currentTarget,
//            this.constructor.components.Popover,
//            {
//                chain: this.chain,
//                update: this.update.bind(this),
//                showSearchInput: this.props.showSearchInput,
//                isDebugMode: this.props.isDebugMode,
//                loadChain: this.loadChain.bind(this),
//                filter: this.props.filter,
//                followRelations: this.props.followRelations,
//            },
//            {
//                closeOnClickAway: true,
//                popoverClass: "o_popover_field_selector",
//            }
//        );
//    }
//}
//ReportModelFieldSelector.props = {
//    ...standardFieldProps,
//    fieldName: { type: String, optional: true },
//    resModel: { type: String, optional: true },
//    showSearchInput: { type: Boolean, optional: true },
//    isDebugMode: { type: Boolean, optional: true },
//    filter: { type: Function, optional: true },
//    followRelations: { type: Boolean, optional: true },
//};
//ReportModelFieldSelector.isEmpty = () => false;
//ReportModelFieldSelector.extractProps = ({ attrs }) => {
//    return {
//        resModel: attrs.options.model,
//    };
//};
//Object.assign(ReportModelFieldSelector, {
//    template: "reports_designer._ReportModelFieldSelector",
//    components: {
//        Popover: ReportModelFieldSelectorPopover,
//    },
//    defaultProps: {
//        readonly: true,
//        isDebugMode: true,
//        showSearchInput: true,
//        update: () => {},
//        filter: () => true,
//        followRelations: true,
//    },
//});
//registry.category("fields").add("report_field", ReportModelFieldSelector);
