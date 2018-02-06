
////////////////////////////////////////////////////
// Custom Small Table Fix
////////////////////////////////////////////////////
(function (manywho) {
  
    function centerChevrons() {

        var chevrons = document.querySelectorAll('.table-small-chevron');

        for (var i = 0; i < chevrons.length; i++) {

            var $chevron = $(chevrons[i]);
            var parentHeight = $chevron.parent().height();

            $chevron.css('margin-top', ((parentHeight / 2) - ($chevron.height() / 2)) + 'px');

        }

    }

    var tableSmall = React.createClass({

        onOutcomeClick: function(e, outcome) {
            var objectDataId = e.target.parentElement.getAttribute('data-item');
            this.props.onOutcome(objectDataId, outcome.id);
        },

        onItemClick: function(e) {

            if (this.props.isDesignTime)
                return;

            e.preventDefault();

            var objectDataId = e.currentTarget.getAttribute('data-item');
            var outcomeId = e.currentTarget.getAttribute('data-outcome');

            this.props.onOutcome(objectDataId, outcomeId);

        },

        componentDidUpdate: centerChevrons,

        componentDidMount: centerChevrons,

        renderRows: function(objectData, outcomes, displayColumns) {

            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            var outcomeComponent = manywho.component.getByName('outcome');

            return objectData.map(function (item) {

                var classNames = ['list-group-item', 'clearfix'];
                var isSelected = this.props.selectedRows.filter(function(row) { return manywho.utils.isEqual(item.externalId, row.externalId, true) }).length > 0;

                if (isSelected) {

                    classNames.push('active');

                }

                var attributes = {
                    className: classNames.join(' '),
                    id: item.externalId,
                    'data-item': item.externalId
                };

                var isOutcomeDestructive = outcomes.filter(function (outcome) {

                    return manywho.utils.isEqual(outcome.pageActionBindingType, 'remove', true)
                        || manywho.utils.isEqual(outcome.pageActionBindingType, 'delete', true);

                }).length > 0;

                var chevron = null;

                if (outcomes.length == 1 && !isOutcomeDestructive) {

                    attributes['data-outcome'] = outcomes[0].id;
                    attributes.onClick = this.onItemClick;
                    chevron = React.DOM.span({ className: 'glyphicon glyphicon-chevron-right table-small-chevron' }, null);

                }

                if (outcomes.length != 1) {

                    attributes.onClick = this.props.onRowClicked;

                }

                return React.DOM.li(attributes, [
                    React.DOM.table({ className: 'table table-small-item' },
                        React.DOM.tbody(null,
                             displayColumns.map(function (column) {

                                if (column == 'mw-outcomes') {

                                   // if (outcomes.length > 1 || isOutcomeDestructive) {

                                        return React.DOM.tr({className: 'table-actions'}, [
                                            React.DOM.th({ className: 'table-small-column table-small-label' }, 'Actions'),
                                            React.DOM.td({ className: 'table-small-column', 'data-item': item.externalId, 'data-model': model.id }, outcomes.map(function (outcome) {

                                                return React.createElement(outcomeComponent, { id: outcome.id, onClick: this.onOutcomeClick, flowKey: this.props.flowKey }, null);

                                            }, this))
                                        ]);

                                    //}

                                }
                                else {

                                    var selectedProperty = item.properties.filter(function (property) {

                                        return property.typeElementPropertyId == column.typeElementPropertyId;

                                    })[0];

                                    if (!manywho.utils.isNullOrWhitespace(column.typeElementPropertyToDisplayId)) {

                                        if (selectedProperty != null && selectedProperty.objectData != null) {

                                            selectedProperty = selectedProperty.objectData[0].properties.filter(function (childProperty) {

                                                return childProperty.typeElementPropertyId == column.typeElementPropertyToDisplayId;

                                            })[0];

                                        }

                                    }

                                    if (selectedProperty) {

                                        var element = React.DOM.span(null, manywho.formatting.format(selectedProperty.contentValue, selectedProperty.contentFormat, selectedProperty.contentType, this.props.flowKey));

                                        if (this.props.isFiles &&
                                            (manywho.utils.isEqual(selectedProperty.typeElementPropertyId, manywho.settings.global('files.downloadUriPropertyId'), true)
                                            || manywho.utils.isEqual(selectedProperty.developerName, manywho.settings.global('files.downloadUriPropertyName'), true))) {

                                            element = React.DOM.a({ href: selectedProperty.contentValue, className: 'btn btn-info', target: '_blank' }, 'Download');

                                        }
                                        else if (!manywho.utils.isNullOrWhitespace(column.componentType))
                                            element = React.createElement(manywho.component.getByName(column.componentType), {
                                                id: item.externalId,
                                                propertyId: column.typeElementPropertyId,
                                                contentValue: selectedProperty.contentValue,
                                                objectData: selectedProperty.objectData,
                                                flowKey: this.props.flowKey,
                                                isEditable: column.isEditable,
                                                contentType: column.contentType,
                                                contentFormat: column.contentFormat
                                            });

                                        return React.DOM.tr(null, [
                                            React.DOM.th({ className: 'table-small-column table-small-label' }, column.label),
                                            React.DOM.td({ className: 'table-small-column' }, element)
                                        ]);

                                    }

                                }

                            }, this)
                        )
                    ),
                    chevron
                ]);

            }, this);

        },

        render: function () {

            manywho.log.info('Rendering Table-Small');

            var classNames = [
                'list-group',
                (this.props.isValid) ? '' : 'table-invalid'
            ].join(' ');

            var items = this.renderRows(this.props.objectData || [], this.props.outcomes, this.props.displayColumns);
            return React.DOM.ul({ className: classNames }, items);

        }

    });

    manywho.component.register("mw-table-small", tableSmall);

}(manywho));