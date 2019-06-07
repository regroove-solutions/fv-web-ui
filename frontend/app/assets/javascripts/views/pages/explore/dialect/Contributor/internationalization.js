const copy = {
  detail: {
    biography: 'Contributor biography',
    name: 'Contributor name',
    title: 'Contributor',
    profilePhoto: 'Contributor photo',
  },
  create: {
    description: 'Contributor biography',
    name: 'Contributor name',
    submit: 'Create new contributor',
    title: 'Create a new contributor',
    profilePhoto: 'Contributor photo',
    success: {
      createAnother: 'Create a new contributor',
      noName: '(No name)',
      thanks: 'Thanks for creating a contributor. Your contributions help make the site better!',
      title: 'We created a new contributor',
      review: 'Here is what you submitted:',
    },
  },
  edit: {
    description: 'Contributor biography',
    name: 'Contributor name',
    submit: 'Edit contributor',
    btnDelete: 'Delete contributor',
    btnDeleteConfirm: 'Yes, delete contributor',
    btnDeleteDeny: 'No, do not delete contributor',
    title: 'Edit a contributor',
    profilePhotoCurrent: 'Current contributor photo',
    profilePhoto: 'Contributor photo',
    profilePhotoExists: 'Replace current contributor photo',
    success: {
      createAnother: 'Made a mistake? Edit the contributor again',
      noName: '(No name)',
      thanks: 'Thanks for updating a contributor. Your contributions help make the site better!',
      title: 'We updated the contributor',
      review: 'Here is what you submitted:',
    },
    successDelete: {
      title: 'We deleted the contributor',
    },
  },
  errorBoundary: {
    explanation: "Sorry about this, but we can't create any new contributors at the moment.",
    optimism: 'The issue should be fixed shortly.',
    title: 'We ran into an issue',
  },
  loading: 'Loading',
  validation: {
    name: 'Please provide a name for the contributor',
  },
}
export default copy
