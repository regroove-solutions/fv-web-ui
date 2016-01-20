import React from 'react';

import DirectoryOperations from 'operations/DirectoryOperations';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

/**
* Explore Language page shows all the dialects in this language
*/
export default class ExploreLanguage extends React.Component {

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

    // Get list of dialects
    DirectoryOperations.getDialectsByLanguage(context.client, props.params.family, props.params.language).then((function(dialects){

      let fieldsToRender = [];

      dialects.each(function(dialect) {

        fieldsToRender.push({
          id: dialect.get("id"),
          title: dialect.get("dc:title"),
          description: dialect.get("dc:description")
        });

      });

      this.setState({
        childData: fieldsToRender
      });

    }).bind(this));

    this._exploreEntry = this._exploreEntry.bind(this);
  }

  _exploreEntry(dialect) {
    this.context.router.push('/explore/' + this.props.params.family + '/' + this.props.params.language + '/' + dialect);
  }

  render() {

    return <div className="row">
            <div className="col-md-4 col-xs-12">
              <h1>{this.props.params.language}</h1>
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