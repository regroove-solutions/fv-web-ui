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
import React, { Component, PropTypes } from 'react';

import Immutable, { List } from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import UIHelpers from 'common/UIHelpers';


import DOMPurify from 'dompurify';
import * as topojson from "topojson-client";
import d3 from "d3"; // TODO LOAD WITH webpack loader.
import ReactFauxDOM from 'react-faux-dom';

import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';

import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';

import CanadaTopoJSON from 'json-loader!models/data/canada.topojson';
import CanadaGeoJSON from 'json-loader!models/data/map.geojson';

import { Map, Marker, Popup, Tooltip, TileLayer, GeoJSON } from 'react-leaflet';

import L from 'leaflet';

require('!style-loader!css-loader!leaflet/dist/leaflet.css');

const position = [64.4115405, -110.5384721];

const defaultStyle = {marginBottom: '20px'};

//Create a tooltip, hidden at the start
var tooltip = d3.select("body").append("div").attr("class","tooltip2");
//Keeps track of currently zoomed feature
var centered;
// Zoom to feature on click
function clicked(d,i) {

  //Add any other onClick events here

  var x, y, k;

  if (d && centered !== d) {
    // Compute the new map center and scale to zoom to
    var centroid = path.centroid(d);
    var b = path.bounds(d);
    x = centroid[0];
    y = centroid[1];
    k = .8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    centered = d
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  // Highlight the new feature
  features.selectAll("path")
      .classed("highlighted",function(d) {
          return d === centered;
      })
      .style("stroke-width", 1 / k + "px"); // Keep the border width constant

  //Zoom and re-center the map
  //Uncomment .transition() and .duration() to make zoom gradual
  features
      //.transition()
      //.duration(500)
      .attr("transform","translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
}


//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
      .text(d.properties.NAME);
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}

var zoom;

export default class Index extends Component {

  constructor(props, context){
    super(props, context);

    let path = d3.geo.path().projection(d3.geo.conicEqualArea()
    .scale(24.8653664820463)
    .center([-96.64130229352139,60.53857675138788]) //projection center
    .parallels([41.9714969544088,83.14808593636062]) //parallels for conic projection
    .rotate([96.64130229352139]) //rotation for conic projection
    .translate([-73.89460458440345,-13.101578219970634]));

    this.state = {
      path: path,
      width: 800,
      height: 700,
      translate: [0,0],
      scale: 1,
      zoom: 1,
      currentBounds: [[83.100354, -144.257421], [40.677028, -47.828260]]
    };

    ['_zoom'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  componentDidMount() {
  }

  _zoom(d) {

    let scale1;
    let scale2;
    let scale3;
    let scaleMax;

    let province = d.properties.CODE;

    switch(province) {
      case 'BC':
        scale1 = 0;
        scale2 = -80;
        scale3 = 1.1;
        scaleMax = [111,111];
      break; 

      default: 
        return;
      break;
    }


    this.setState({
      path:d3.geo.path().projection(d3.geo.conicEqualArea()
    .scale(764.8653664820463)
    .center([-96.64130229352139,60.53857675138788]) //projection center
    .parallels([41.9714969544088,83.14808593636062]) //parallels for conic projection
    .rotate([96.64130229352139]) //rotation for conic projection
    .translate([-73.89460458440345,-13.101578219970634])),
      width: 800,
      height: 600,
      translate: this.state.translate.map(function(v, i){
        return (i == 0) ? v + scale1 : v + scale2;
      }),
      scale: this.state.scale * scale3
    });

  }

  render () {
//Keeps track of currently zoomed feature
var centered;

//Create a path for each map feature in the data

    var self = this
    var svg = d3.select(ReactFauxDOM.createElement('svg'))
      .attr({
        width: this.state.width,
        height: this.state.height
      })

    var features = svg.append("g")
    .attr("class","features");

  features.selectAll("path")
    //.style("stroke-width", "1px" )
    .data(topojson.feature(CanadaTopoJSON,CanadaTopoJSON.objects.collection).features) //generate features from TopoJSON
    .enter()
    .append("path")
    .attr("d",this.state.path)
    .attr("transform", "translate(" + this.state.translate + ") scale(" + this.state.scale + ")")
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",this._zoom);

  let svgToRender = svg.node().toReact();
// maxBounds={[[83.100354, -144.257421], [40.677028, -47.828260]]}
// minZoom={2.2}
    return <Map center={position} onZoom={ (e) => this.setState({zoom: e.target._zoom}) } zoom={this.state.zoom} bounds={this.state.currentBounds}>
        <GeoJSON
            style={function(feature) {
                switch (selectn('properties.CODE', feature)) {
                    case 'BC': return {color: "#ff0000"};
                    case 'YT':   return {color: "#0000ff"};
                }
            }}
            onEachFeature={function (feature, layer) {
              //layer.bindPopup('Hello world!');
              layer.bindTooltip(selectn('properties.NAME', feature));
              layer.on('click', function(e) {
                //console.log(feature);
                //console.log(e.target.getBounds());
                this.setState({
                  //zoom: this.state.zoom * 2,
                  currentBounds: e.target.getBounds()
                })
              }.bind(this))
            }.bind(this)}
            data={CanadaGeoJSON} />
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {(this.props.dialects || []).map(function(dialect, i) {

          let myIcon = L.icon({
              iconUrl: UIHelpers.getThumbnail(selectn('contextParameters.portal.fv-portal:logo', dialect), 'Thumbnail') || '/assets/images/cover.png',
              iconSize: [25, 25],
          });

          let location = '';
          let region = selectn('contextParameters.ancestry.dialect.fvdialect:region', dialect);
          let country = selectn('contextParameters.ancestry.dialect.fvdialect:country', dialect);

          if (country && region) {
            location = region + ', ' + country;
          } else if (region) {
            location = region;
          }

          return <Marker icon={myIcon} position={[53.293064 * i, -132.218825 * i]}>
            <Popup>
              <span>{selectn('contextParameters.ancestry.dialect.dc:title', dialect)}<br/>{location}<br/><a href={"/explore" + selectn('contextParameters.ancestry.dialect.path', dialect)}>Go To Dialect</a></span>
            </Popup>
          </Marker>;
        })}

      </Map>;
  }
}