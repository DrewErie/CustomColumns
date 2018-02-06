////////////////////////////////////////////////////
// Custom Column Progress Bar
////////////////////////////////////////////////////
var progressColumn = React.createClass({
    render() {

        if (this.props.contentValue) {

            raw = this.props.contentValue;

            var contentNum = Number(raw.substring(0, raw.indexOf('/')));

            var maxNum = Number(raw.substring(raw.indexOf("/") + 1));       
            

            var rawperc = (contentNum / maxNum)* 100;
            var perc = Math.round( rawperc );

            var divStyle = {
                width: perc + '%'                              
            };

            var innerContent = contentNum + "/" + maxNum; 

            if(perc < 15){
                divClasses = "progress-bar progress-bar-danger";
            } else if(perc < 30){
                divClasses = "progress-bar progress-bar-warning";
            } else {
                divClasses = "progress-bar";
            }

            return React.createElement(
                "div",
                { "className": "progress progress-custom"},
                React.createElement(
                  "div",
                  { "className": divClasses, role: "progressbar", "aria-valuenow": perc,
                    "aria-valuemin": "0", "aria-valuemax": "100", style: divStyle },
                  innerContent
                )
              );                            
        }                       
        return null;
    }
});

manywho.component.register('progress-column', progressColumn);