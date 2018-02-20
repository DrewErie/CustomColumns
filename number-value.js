////////////////////////////////////////////////////
// Custom Column - Format as Number w/ Commas 
////////////////////////////////////////////////////
var numberColumn = React.createClass({
    render() {
        if (this.props.contentValue) {
        	numvalue = Number(this.props.contentValue);
        	return React.createElement('span', { className: "number-value"}, numvalue.toLocaleString());
        }				        
        return null;
    }
});

manywho.component.register('num-column', numberColumn);