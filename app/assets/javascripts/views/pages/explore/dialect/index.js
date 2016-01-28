import React from 'react';
import classNames from 'classnames';

// Models
import Dialect from 'models/Dialect';
import Dialects from 'models/Dialects';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

// Views
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import RaisedButton from 'material-ui/lib/raised-button';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';

/**
* Dialect portal page showing all the various components of this dialect.
*/
export default class ExploreDialect extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      dialect: null
    };

    // Create new operations object
    this.dialectOperations = new DocumentOperations(Dialect, Dialects, context.client, { domain: context.siteProps.domain });

    this._fetchDialect();

    this._navigate = this._navigate.bind(this);
  }

  // Handle change of params when navigating within router
  // See https://github.com/rackt/react-router/blob/latest/docs/guides/advanced/ComponentLifecycle.md
  componentDidUpdate (prevProps) {
    let oldDialect = prevProps.params.dialect;
    let newDialect = this.props.params.dialect;

    if (newDialect !== oldDialect)
      this._fetchDialect();
  }

  _fetchDialect() {
    this.dialectOperations.getDocumentByPathAndTitle(
      '/Workspaces/Data/' + this.props.params.family + '/' + this.props.params.language + '/', this.props.params.dialect,
      {headers: { 'X-NXenrichers.document': 'firstvoices' }}
    ).then((function(dialect){
      this.setState({
        dialect: dialect
      });
    }).bind(this));
  }

  _navigate(page) {
    this.context.router.push('/explore/' + this.state.dialect.get("parentLanguageFamily").title + '/' + this.state.dialect.get("parentLanguage").title + '/' + this.state.dialect.get("dc:title") + '/' + page);
  }

  render() {

    // Assign dialect prop to all children
    let content = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, { dialect: this.state.dialect });
    }, this);

    // If no children, render main content.
    if (!this.props.children) {

      content = <div className="row">

        <div className={classNames('col-xs-12', 'col-md-2')}>
          <h1>First Words</h1>
          <p>First words here</p>
        </div>

        <div className={classNames('col-xs-12', 'col-md-6')}>
          <h1>{(this.state.dialect) ? this.state.dialect.get('dc:title') : ""} Portal</h1>
          <p>&quot;Pelpala7w&iacute;t i ucwalm&iacute;cwa m&uacute;ta7 ti tm&iacute;cwa &quot;- The people and land are one We are the Lilwat Nation, an Interior Salish people We live in a stunning and dramatic landscape with a rich biodiversity-a mysterious place of towering mountains,ice fields,alpine meadows,white-water rivers and braided river valleys that run to a milky color due to the silt and clay deposited by glacial melt. While Lilwat is a separate and distinct Nation, its still remains part of the St'at'imc Nation Our Language is called Ucwalmicwts. It is taught at both X'itolacw Community School and Pemberton Secondary School. Lilwat Also has a Language Immersion school which goes from Nursey to grade three and each subject in the immersion school is taught in the Ucwalmicwts Language. L&iacute;&#318;wat Nation (L&iacute;&#318;wat means where the rivers meet). </p>

          <p>Originally the Lil'wat7&uacute;l managed a vast territory within the headwaters of the three rivers: Green River, Lillooet River and the Birkenhead River. </p>

          <p>We are building a language retention strategy in the manner of nt'&aacute;kmen &amp; nx&eacute;kmen, and in 1974 was the inception of the written language in our community.</p>

          <p>Cedar is inherent in our lives from birth until death. It provides a basket for our children and is used to cradle our loved ones when they pass into the spirit world. We use it for clothing, transportation, art, regalia, shelter, gathering food, cooking and as medicine. </p>

          <p>Listen to our words, and explore the Lil'wat Language! CUYSTW&Iacute; MALH UCWALM&Iacute;CWTS- lets all go speak our Language!</p>
        </div>

        <div className={classNames('col-xs-12', 'col-md-4')}>
          <h1>Status of Our Language</h1>
          <p>Status of our language here.</p>
        </div>

      </div>
    }

    return <div>

            <Toolbar>

              <ToolbarGroup firstChild={true} float="left">
                <RaisedButton onTouchTap={this._navigate.bind(this, '')} label="Home" /> 
                <RaisedButton onTouchTap={this._navigate.bind(this, 'learn')} label="Learn" /> 
                <RaisedButton onTouchTap={this._navigate.bind(this, 'play')} label="Play" /> 
                <RaisedButton onTouchTap={this._navigate.bind(this, 'community-slideshow')} label="Community Slideshow" /> 
                <RaisedButton onTouchTap={this._navigate.bind(this, 'art-gallery')} label="Art Gallery" /> 
              </ToolbarGroup>

              <ToolbarGroup firstChild={true} float="right">
                <IconMenu iconButtonElement={
                  <IconButton tooltip="More Options" touch={true}>
                    <NavigationExpandMoreIcon />
                  </IconButton>
                }>
                  <MenuItem primaryText="Edit Portal" />
                  <MenuItem primaryText="Contact" />
                </IconMenu>
              </ToolbarGroup>

            </Toolbar>

            {content}

        </div>;
  }
}