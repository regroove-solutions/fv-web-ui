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

export default class GetStarted extends React.Component {

  render() {

    return <div className="row">
            <div className="col-md-8 col-xs-12">
              <h2>What is FirstVoices?</h2>
              <p>FirstVoices is a suite of web-based tools and services designed to support Aboriginal people engaged in language archiving, language teaching &amp; culture revitalization.</p>
              <p>The FirstVoices Language Archive contains thousands of text entries in many diverse Aboriginal writing systems, enhanced with sounds, pictures and videos.</p>
              <p>A companion set of interactive online games is designed to present the archived FirstVoices language data in creative learning activities.</p>
              <p>Some language archives at FirstVoices are publicly accessible, while others are password protected at the request of the language community.</p>

              <h3>Donate to FirstVoices </h3>

              <p>
                We gratefully accept donations to FirstVoices.<br/>For more information, please contact the First Peoples' Cultural Foundation at www.fpcf.ca.</p>
                <p>Hy'chka, Gilakas'la, Kleco-Kleco, Thank You!</p>
                <p>We gratefully acknowledge support from the New Relationship Trust, TELUS, the Department of Canadian Heritage, and the Government of British Columbia.</p>
            </div>
            <div className="col-md-4 col-xs-12">
              <h2>Contact Us</h2>
              <p>Aboriginal communities interested in archiving and teaching their languages using the FirstVoices multimedia language tools are invited to contact the FirstVoices team:</p>
              <p>Alex Wadsworth, I.T., FirstVoices and Mapping Manager<br/>
              Telephone: (250) 652-5952 ext. 205<br/>
              Email: (alex@firstvoices.com)</p>
            </div>
          </div>;
  }
}