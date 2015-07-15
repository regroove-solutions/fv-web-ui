var React = require('react');
var Mui = require('material-ui');
var {MenuItem, LeftNav} = Mui;
var {Colors, Spacing, Typography} = Mui.Styles;

var menuItems = [
    { route: 'get-started', text: 'Get Started' },
    { route: 'browse', text: 'Browse' },
    { route: 'contribute', text: 'Contribute' },
    { type: MenuItem.Types.SUBHEADER, text: 'External Resources' },
    { type: MenuItem.Types.LINK, payload: 'http://www.firstvoices.com/', text: 'First Voices', target: '_blank' },
    { type: MenuItem.Types.LINK, payload: 'http://www.gov.bc.ca/', text: 'Gov.bc.ca', target: '_blank' }
  ];

class AppLeftNav extends React.Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this._onLeftNavChange = this._onLeftNavChange.bind(this);
    this._onHeaderClick = this._onHeaderClick.bind(this);
  }

  getStyles() {
    return {
      cursor: 'pointer',
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.cyan500,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '8px'
    };
  }

  render() {
    var header = (
      <div style={this.getStyles()} onTouchTap={this._onHeaderClick}>
        {this.props.title}
      </div>
    );

    return (
      <LeftNav 
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={menuItems}
        onChange={this._onLeftNavChange} />
    );
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  _onLeftNavChange(e, key, payload) {
    this.props.router.navigate(payload.route, true);
  }

  _onHeaderClick() {
    this.props.router.navigate('', true);
    this.refs.leftNav.close();
  }

}

AppLeftNav.contextTypes = {
  router: React.PropTypes.func
};

module.exports = AppLeftNav;