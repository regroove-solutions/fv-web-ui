import React from 'react';
import classNames from 'classnames';

import RaisedButton from 'material-ui/lib/raised-button';

/**
* Learn portion of the dialect portal
*/
export default class Learn extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this._navigate = this._navigate.bind(this);
  }

  _navigate(page) {
    this.context.router.push('/explore/' + this.props.params.family + '/' + this.props.params.language + '/' + this.props.params.dialect + '/learn/' + page );
  }

  render() {

    // Assign dialect prop, from parent, to all children
    let content = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, { dialect: this.props.dialect });
    }, this);

    // If no children, render main content.
    if (!this.props.children) {
      content = <div className="row">

        <div className={classNames('col-xs-12', 'col-md-6')}>
          <h1>About our Language</h1>
          <p>&quot;Pelpala7w&iacute;t i ucwalm&iacute;cwa m&uacute;ta7 ti tm&iacute;cwa &quot;- The people and land are one We are the Lilwat Nation, an Interior Salish people We live in a stunning and dramatic landscape with a rich biodiversity-a mysterious place of towering mountains,ice fields,alpine meadows,white-water rivers and braided river valleys that run to a milky color due to the silt and clay deposited by glacial melt. While Lilwat is a separate and distinct Nation, its still remains part of the St'at'imc Nation Our Language is called Ucwalmicwts. It is taught at both X'itolacw Community School and Pemberton Secondary School. Lilwat Also has a Language Immersion school which goes from Nursey to grade three and each subject in the immersion school is taught in the Ucwalmicwts Language. L&iacute;&#318;wat Nation (L&iacute;&#318;wat means where the rivers meet). </p>

          <p>Originally the Lil'wat7&uacute;l managed a vast territory within the headwaters of the three rivers: Green River, Lillooet River and the Birkenhead River. </p>

          <p>We are building a language retention strategy in the manner of nt'&aacute;kmen &amp; nx&eacute;kmen, and in 1974 was the inception of the written language in our community.</p>

          <p>Cedar is inherent in our lives from birth until death. It provides a basket for our children and is used to cradle our loved ones when they pass into the spirit world. We use it for clothing, transportation, art, regalia, shelter, gathering food, cooking and as medicine. </p>

          <p>Listen to our words, and explore the Lil'wat Language! CUYSTW&Iacute; MALH UCWALM&Iacute;CWTS- lets all go speak our Language!</p>
        </div>

        <div className={classNames('col-xs-12', 'col-md-2')}>
          <h1>{(this.props.dialect) ? this.props.dialect.get('dc:title') : this.props.params.dialect} Alphabet</h1>
          <p>First words here</p>
        </div>

        <div className={classNames('col-xs-12', 'col-md-4')}>
          <h1>Contact Info</h1>
          <p>Status of our language here.</p>
          <h1>Keyboards</h1>
          <p>Keyboards</p>
        </div>

      </div>
    }

    return <div>
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'words')} label="Words" secondary={true} /> 
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'phrases')} label="Phrases" secondary={true} /> 
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'songs')} label="Songs" secondary={true} /> 
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'stories')} label="Stories" secondary={true} /> 
                </div>
              </div>
            </div>

            {content}
        </div>;
  }
}