import React, {Component, PropTypes} from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';

// Models
import {Document} from 'nuxeo';

// Schemas
import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

import IconButton from 'material-ui/lib/icon-button';
import CircularProgress from 'material-ui/lib/circular-progress';

@provide
export default class EditableComponent extends Component {

  static propTypes = {
    computeEditMode: PropTypes.object.isRequired,
    enableEditMode: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    property: PropTypes.string.isRequired
  };

  static defaultProps = {
    computeEditMode: {}
  };

  /**
  * Allows an element to be rendered as regular text or as an editable form, derived from a larger type (e.g. fv-portal:about from FVPortal type)
  * Note: This will only work with 'properties' from the document as they are the only mutable fields.
  * @param {property} string - The property field id (used for Structs)
  * @param {entity} doc - The entitiy to derive current values from, Nuxeo doc object
  * @returns - Element to be rendered
  */
  _editableElement() {

    const { property } = this.props;

    let entity = this.props.computePortal.response;

    // If still computing, return spinner
    if (entity.isFetching)
      return <CircularProgress mode="indeterminate" size={0.5} />;

    // Get current value for field from properties
    let currentValue = selectn("properties." + property, entity);

    // Get all options for type from entity field definition
    let fieldFormOptions = selectn(entity.type, options);

    // Handle edit mode
    if (this.props.computeEditMode[property]) {

      let fieldFormValues = {};
      let fieldFormStruct, fieldFormFields = null;

      // Get all fields for type from entity field definition
      fieldFormFields = selectn(entity.type, fields);

      // If fields and options found, try to create form our of field
      if (fieldFormFields && fieldFormOptions) {

        // Create a sub-structure for this field
        let newFieldFormSchema = {};

        // Set field to be new schema (note: selectn doesn't work with functions defined in maps)
        newFieldFormSchema[property] = fieldFormFields[property];

        if (newFieldFormSchema) {

          // Create a new sub-structure for schema
          fieldFormStruct = t.struct(newFieldFormSchema);

          // Set default value to current value
          fieldFormValues[property] = currentValue;
            return <form onSubmit={e => this._onRequestSaveField(e, property)}>
                    <t.form.Form ref={"form_" + property} value={fieldFormValues} type={fieldFormStruct} options={fieldFormOptions} />
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Save</button> 
                    </div>
                   </form>;
        }
      }
    }

    // Render regular field if not in edit mode
    return <div>
            <div dangerouslySetInnerHTML={{__html: currentValue}}></div>
              <IconButton iconClassName="material-icons" onTouchTap={this._onEditRequest.bind(this, property)} tooltip={"Edit"}>mode_edit</IconButton>
           </div>;
  }


  _onRequestSaveField(e, property) {

    // Prevent default behaviour
    e.preventDefault();

    // TODO: Find better way to construct object then accessing internal function
    // Create new document rather than modifying the original document
    let newDocument = new Document(this.props.computePortal.response, { 
      'repository': this.props.computePortal.response._repository,
      'nuxeo': this.props.computePortal.response._nuxeo
    });

    // Set new value property on document
    newDocument.set(this.refs["form_" + property].getValue());

    // Save document
    this.props.updatePortal(newDocument, property);
  }


  shouldComponentUpdate(newProps) {

    // Don't re-render if fetching
    if (newProps.computePortal.isFetching) {
      return false;
    }

    return true;
  }

  _onEditRequest(fieldToEdit) {
    this.props.enableEditMode(fieldToEdit);
  }

    constructor(props, context) {
        super(props, context);

        // Bind methods to 'this'
        ['_onEditRequest', '_onRequestSaveField'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    render() {
        return (<div>{this._editableElement()}</div>);
    };
}

////////////// Scenario when I Edit, make a change, then go to edit something else.....
////////////// Should I save state on key refresh?!
////////////// Jumping characters