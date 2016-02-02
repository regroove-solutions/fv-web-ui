/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react';

// Models
import LanguageFamily from 'models/LanguageFamily';
import LanguageFamilies from 'models/LanguageFamilies';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

/**
* Explore Archive page shows all the families in the archive
*/
export default class ExploreArchive extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      childData: []
    }

    // Create new operations object
    this.languageFamilyOperations = new DirectoryOperations(LanguageFamily, LanguageFamilies, context.client, { domain: context.siteProps.domain });

    // Get list of language families
    this.languageFamilyOperations.getDocumentsByPath("/sections").then((function(families){

      let fieldsToRender = [];

      families.each(function(family) {
        fieldsToRender.push({
          id: family.get("id"),
          title: family.get("dc:title"),
          description: family.get("dc:description"),
          countries: family.get("fvlanguagefamily:countries")
        });

      });

      this.setState({
        childData: fieldsToRender
      });

    }).bind(this));

    this._exploreEntry = this._exploreEntry.bind(this);
  }

  _exploreEntry(language) {
    this.context.router.push('/explore/' + language);
  }

  render() {

    let content = "No published Language Families found.";

    if (this.state.childData && this.state.childData.length > 0) {
      content = <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
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
    }

    return <div className="row">
            <div className="col-md-4 col-xs-12">
              <h1>Explore Archive</h1>
              <div>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>;
              </div>
            </div>
            <div className="col-md-8 col-xs-12">
              {content}
            </div>
          </div>;
  }
}