import ConfGlobal from 'conf/local.json';
import Nuxeo from 'nuxeo';

export default class BaseOperations {
  static properties = {
    condition: "ecm:currentLifeCycleState <> 'deleted'",
    client: null
  };

  static initClient() {
    this.properties.client = new Nuxeo({
      baseURL: ConfGlobal.baseURL,
      restPath: 'site/api/v1',
      automationPath: 'site/automation',
      timeout: 30000
    });

    this.properties.client.header('X-NXproperties', '*');
  }

  static setClient(client) {
    this.properties.client = client;
  }
}