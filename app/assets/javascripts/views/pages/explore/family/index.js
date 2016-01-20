import React from 'react';

import DirectoryOperations from 'operations/DirectoryOperations';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

/**
* Explore Family page shows all the languages in this family
*/
export default class ExploreFamily extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      childData: []
    }

    // Get list of languages
    DirectoryOperations.getLanguages(context.client, props.params.family).then((function(languages){

      let fieldsToRender = [];

      languages.each(function(language) {

        fieldsToRender.push({
          id: language.get("id"),
          title: language.get("dc:title"),
          description: language.get("dc:description")
        });

      });

      this.setState({
        childData: fieldsToRender
      });

    }).bind(this));

    this._exploreEntry = this._exploreEntry.bind(this);
  }

  _exploreEntry(language) {
    this.context.router.push('/explore/' + this.props.params.family + '/' + language);
  }

  render() {

    return <div className="row">
            <div className="col-md-4 col-xs-12">
              <h1>{this.props.params.family}</h1>
              <div>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>;
              </div>
            </div>
            <div className="col-md-8 col-xs-12">

              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                <GridList
                  cols={2}
                  cellHeight={200}
                  style={{width: '100%', height: 800, overflowY: 'auto', marginBottom: 24}}
                  >
                    {this.state.childData.map((tile, i) => 
                      <GridTile
                        onTouchTap={this._exploreEntry.bind(this, tile.title)}
                        key={tile.id}
                        title={tile.title}
                        subtitle={tile.description}
                        ><img src="http://www.firstvoices.com/portal/tag1-1a.jpg" /></GridTile>
                    )}
                </GridList>
              </div>
            </div>
          </div>;
  }
}