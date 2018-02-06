////////////////////////////////////////////////////
// Custom Column - Format as USD
////////////////////////////////////////////////////
var usdColumn = React.createClass({
    render() {
        if (this.props.contentValue) {
        	numvalue = Number(this.props.contentValue);
        	return React.createElement('span', { className: "usd-value"}, numvalue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
        }				        
        return null;
    }
});

manywho.component.register('usd-column', usdColumn);