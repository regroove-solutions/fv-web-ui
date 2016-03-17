/**
 * 
 */

package ca.firstvoices.publisher.operations;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.automation.core.collectors.BlobCollector;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;

/**
 * @author loopingz
 */
@Operation(id=UnpublishDialectOperation.ID, category=Constants.CAT_DOCUMENT, label="PublishDialect", description="")
public class UnpublishDialectOperation {

    public static final String ID = "UnpublishDialect";

    public static final FirstVoicesPublisherService service = Framework.getLocalService(FirstVoicesPublisherService.class);

    @OperationMethod
    public void run(DocumentModel input) {
       service.unpublishDialect(input);
    }    

}
