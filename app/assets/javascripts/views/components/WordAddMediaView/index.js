var React = require('react');
var t = require('tcomb-form');
//var $ = require('jquery');
var Form = t.form.Form;

var FileReadStream = require('filestream/read');
var Underscore = require('underscore');
var _ = Underscore;

var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

var Word = require('models/Word');

//var DataGrid = require('react-datagrid');

//require('!style!css!react-datagrid/dist/index.min.css');

// Typeahead - https://github.com/gcanti/tcomb-form/issues/138

 function getSubjects(client) {

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

            client.request('directory/subtopic')
           .get(function(error, data) {
             if (error) {
               // something went wrong
               throw error;
             }

            if (data.entries.length > 0) {
                var subtopics = _.object(_.map(data.entries, function(entry){ return [entry.properties.id, entry.properties.label]; }));
                resolve(subtopics);
            } else {
              reject('Workspace not found');
            }

          });

        });

    }


  function getPartsOfSpeech(client) {

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

            client.request('directory/parts_speech')
           .get(function(error, data) {
             if (error) {
               // something went wrong
               throw error;
             }

            if (data.entries.length > 0) {
                var parts_speech = _.object(_.map(data.entries, function(entry){ return [entry.properties.id, entry.properties.label]; }));
                resolve(parts_speech);
            } else {
              reject('Workspace not found');
            }

          });

        });

    }

class FormSample2 extends React.Component {

  constructor(props) {
    super(props);

    //this._getPartsOfSpeech = this._getPartsOfSpeech.bind(this);
    //this._getSubjects = this._getSubjects.bind(this);
    this._change = this._change.bind(this);
    this._save = this._save.bind(this);


    var schema = t.struct({
        /*'dc:title': t.Str,
        'dc:description': t.Str,*/
        'file': t.form.File
    });

   this.state = {
      uploading: false,
      schema: schema,
      options: {
        fields: {
          'dc:title': {
            label: 'Media Title'
          },
          'dc:description': {
            label: 'Media Description',
            type: 'textarea'
          },
          'file': {
            label: 'File',
            type: 'file'
          }
        },
        config: {
          // for each of lg md sm xs you can specify the columns width
          horizontal: {
            md: [3, 9],
            sm: [6, 6]
          }
        }
      },
      word: props.word,
   };
  }

  _change(value) {
    this.setState({value});
  }

  _save(evt) {

    this.setState({'uploading': true});

/*
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
      var fd = new FormData();
      for (var k in value) {
        var v = value[k];
        if (t.form.File.is(v)) {
          fd.append(k, v, v.name);
        } else {
          fd.append(k, v);
        }
      }
      console.log(fd);
      // process form data...
    }*/


    var client = this.state.word.get('client');
    var value = this.refs.form.getValue();

    var self = this;
    // if validation fails, value will be null
    if (value) {
      var testFileObj;
      //console.log(evt);
//console.log(React.findDOMNode(this.refs.form.refs.input.refs.file).files[0]);
      var fd = new FormData();
      for (var k in value) {
        var v = value[k];
        if (t.form.File.is(v)) {
          fd.append(k, v, v.name);
          testFileObj = v;
        } else {
          fd.append(k, v);
        }
      }

//var formData = new FormData($("#myForm"));
/*
formData.append("username", "Groucho");
formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"

// HTML file input, chosen by user
formData.append("userfile", React.findDOMNode(this.refs.form.refs.input.refs.file));

// JavaScript file-like object
var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
var blob = new Blob([content], { type: "text/xml"});

formData.append("webmasterfile", blob);

*/



















var headers = {};


headers["X-Batch-Id"]= 'batch-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000);
headers["X-File-Idx"]= 0;
headers["authorization"]= "Basic d2ViYXBwOjB2dldYMDlwNngwYTgzUw==";
headers['Cache-Control'] = 'no-cache';
headers["X-File-Name"]= encodeURIComponent(testFileObj.name);
headers["X-File-Size"]= testFileObj.size;
headers["X-File-Type"]= testFileObj.type;
headers["Content-Type"]= "binary/octet-stream";

//console.log(headers);
   var xhrParams = {
      type: 'POST',
      //timeout: this._timeout,
      headers: headers,
      cache: false,
      contentType: false,
      processData: false,
      data: testFileObj,
      url: 'http://ec2-50-112-240-83.us-west-2.compute.amazonaws.com/nuxeo/site/automation/batch/upload'//,
      //xhrFields: this._client._xhrFields
    };
/*
    $.ajax(xhrParams)
      .done(function(data, textStatus, jqXHR) {
      client.operation('Document.Create')
       .params({
         type: 'Picture',
         name: 'myNewThingie333',
       })
       .param('properties',
          {
            "dc:title": "1002more!",
            "file:content": {"upload-batch":data.batchId,"upload-fileId":"0"}
          }
        )
       .input(self.state.word.get('id'))
       .execute(function(error, doc) {
         if (error) {
           // something went wrong
           throw error;
         }

console.log(doc);
       });
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });*/




    var request = new XMLHttpRequest();
var self = this;
request.onreadystatechange = function() {
    if (request.readyState == 4) {
      var jsonResponse = JSON.parse(request.responseText);
      var nuxeoType = "File";
//console.log(testFileObj.type.substring(0, testFileObj.type.indexOf('/')));

      switch(testFileObj.type.substring(0, testFileObj.type.indexOf('/'))) {
        case "image":
          nuxeoType = "Picture";
        break;
        case "audio":
          nuxeoType = "Audio";
        break;
        case "video":
          nuxeoType = "Video";
        break;
      }

      client.operation('Document.Create')
       .params({
         type: nuxeoType,
         name: testFileObj.name,
       })
       .param('properties',
          {
            "dc:title": testFileObj.name,
            "file:content": {"upload-batch":jsonResponse.batchId,"upload-fileId":"0"}
          }
        )
       .input(self.state.word.get('id'))
       .execute(function(error, doc) {
         if (error) {
           // something went wrong
           throw error;
         }

         location.reload();

         //self.props.router.navigate("browse/word/" + doc.uid , {trigger: true});

//console.log(doc);

//console.log( doc.uid);
             /*var uploader = client.operation("Blob.Attach")
             .params({ document: doc.uid,
               save : true,
               xpath: "file:content"
             }).uploader();*/

             /*
{ uploadProgressUpdatedCallback: function(fileIndex, file, newProgress) { 
                  $(".progress div").width(newProgress + "%");
                  $(".progress div").attr("aria-valuenow", newProgress + "%");
                  $(".progress div span.sr-only span").text(newProgress + "%");
                } }
             */


    //console.log(fileMe)
             //var aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
             //var oMyBlob = new Blob(aFileParts, {type : 'text/html'}); // the blob
    //console.log(oMyBlob);

    //var ttt = new FileReadStream(fd, {chunkSize : 128965});

/*
             uploader.uploadFile(fd, function(fileIndex, file, timeDiff) {
              console.log('here');
                  // When done, execute the operation
                  uploader.execute(function(error, data) {
                    if (error) {
                      // something went wrong
                      console.log("error!!!");
                      console.log(data);
                      console.log(error);
                      throw error;
                    }
                 
                    // successfully attached blob
                    console.log("attached");
                    //$(".progress div").addClass("progress-bar-success");
                    //$(".progress div").text("Upload Complete!");
                  });
                });
*/
             
         
         //console.log("here" + document.uid);
         //console.log(docID);
       //});

         //self.props.router.navigate("browse/word/" + doc.uid , {trigger: true});
       });
    }
}
//console.log(testFileObj);
request.open("POST", "http://ec2-50-112-240-83.us-west-2.compute.amazonaws.com/nuxeo/site/automation/batch/upload");
request.setRequestHeader("X-Batch-Id", 'batch-' + new Date().getTime() + '-' + Math.floor(Math.random() * 100000));
request.setRequestHeader("X-File-Idx", 0);
request.setRequestHeader("authorization", "Basic QWRtaW5pc3RyYXRvcjpYN1BjRVh1YVlzeG1nako=");
request.setRequestHeader("X-File-Name", encodeURIComponent(testFileObj.name));
request.setRequestHeader("X-File-Size", testFileObj.size);
request.setRequestHeader("X-File-Type", testFileObj.type);
request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
request.setRequestHeader("Content-Type", "binary/octet-stream");
request.send(testFileObj);

   }

   evt.preventDefault();    
  }

  render() {

var form = "";

if (this.state.schema != undefined){
 form = <form onSubmit={this._save} id="myForm" encType="multipart/form-data">
        <Form
          ref="form"
          options={this.state.options}
          type={this.state.schema} 
          value={this.state.value}
          onChange={this._change} />
          <button type="submit" className={classNames('btn', 'btn-primary')}>Upload Media</button>
      </form>;
}

  var uploadText = "";

  if (this.state.uploading) {
    uploadText = <div className={classNames('alert', 'alert-info')} role="alert">Uploading... Please be patient...</div>
  }

    return (
      <div className="form-horizontal">
        {uploadText}
        {form}
      </div>
    );
  }


}

class WordAddMediaView extends React.Component {

  constructor(props) {
    super(props);

   this.state = {
      word: props.word
   };

  }

  componentDidMount() {
  }


  render() {

      // Styles
      var DataGridStyles = {
        zIndex: 0
      };


    return <div>
      <FormSample2
        client={this.props.client}
        router={this.props.router}
        word={this.state.word} />
    </div>;
  }


}

WordAddMediaView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = WordAddMediaView;