import NavigationHelpers from 'common/NavigationHelpers'
import Nuxeo from 'nuxeo'
import IntlService from 'views/services/intl'

export default class BaseOperations {
  static properties = {
    condition: 'ecm:isTrashed = 0 ',
    client: new Nuxeo({
      baseURL: NavigationHelpers.getBaseURL(),
      restPath: 'site/api/v1',
      automationPath: 'site/automation',
      timeout: 60000,
    }),
  }

  static initClient() {
    this.properties.client.schemas('*')
  }

  static setClient(client) {
    this.properties.client = client
  }

  static getProperties() {
    return this.properties
  }

  static intl = IntlService.instance
}
