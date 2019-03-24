import Nuxeo from "nuxeo"
import IntlService from "views/services/intl"

import NavigationHelpers from "common/NavigationHelpers"
export default class BaseOperations {
  static properties = {
    condition: "ecm:currentLifeCycleState <> 'deleted'",
    client: new Nuxeo({
      baseURL: NavigationHelpers.getBaseURL(),
      restPath: "site/api/v1",
      automationPath: "site/automation",
      timeout: 300,
    }),
  }

  static initClient() {
    this.properties.client.header("X-NXproperties", "*")
  }

  static setClient(client) {
    this.properties.client = client
  }

  static intl = IntlService.instance
}
