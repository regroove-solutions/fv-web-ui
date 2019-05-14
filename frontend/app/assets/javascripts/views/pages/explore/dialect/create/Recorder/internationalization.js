const copy = {
  default: {
    description: 'Recorder description',
    name: 'Recorder name',
    submit: 'Create new recorder',
    title: 'Create a new recorder',
    success: {
      createAnother: 'Want to create another recorder?',
      noName: '(No name)',
      thanks: 'Thanks for creating a recorder. Your contributions help make the site better!',
      title: 'We created a new recorder',
      review: 'Here is what you submitted:',
    },
  },
  edit: {
    submit: 'Edit recorder',
    title: 'Edit a recorder',
    success: {
      createAnother: 'Made a mistake? Edit the recorder again',
      noName: '(No name)',
      thanks: 'Thanks for updating a recorder. Your contributions help make the site better!',
      title: 'We updated the recorder',
      review: 'Here is what you submitted:',
    },
  },
  errorBoundary: {
    explanation: "Sorry about this, but we can't create any new recorders at the moment.",
    optimism: 'The issue should be fixed shortly.',
    title: 'We encountered a problem',
  },
  loading: 'Loading',
  validation: {
    name: 'Please provide a name for the recorder',
  },
}
export default copy
