// TODO: IMPORT ONLY WHAT IS USED
import * as yup from 'yup'

// V1 using t.comb:
// import Dublincore from 'models/schemas/Dublincore'
// FVAudio: Object.assign({}, Dublincore, FVMedia),
// import FVMedia from 'models/schemas/FVMedia'
/*
  'dc:title': t.String,
  'dc:description': t.maybe(t.String),
  'file': t.form.File,
  'fvm:shared': t.Boolean,
  'fvm:child_focused': t.Boolean,
  'fvm:recorder': t.list(t.String),
  'fvm:source': t.list(t.String),
*/
import copy from './internationalization'

const validForm = yup.object().shape({
  'dc:title': yup
    .string()
    .label(copy.name)
    .required(copy.validation.name),
  'dc:description': yup.string(),
  file: yup.string(),
  'fvm:shared': yup.boolean(),
  'fvm:child_focused': yup.boolean(),
  'fvm:recorder': yup.array().of(yup.string()),
  'fvm:source': yup.array().of(yup.string()),
})

export default validForm
