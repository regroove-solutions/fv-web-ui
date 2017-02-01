/**
 * Compute asset custom order when asset (Word/Phrase) modified or created.
 */
package ca.firstvoices.nativeorder.listeners;

import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.api.model.DocumentPart;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;
import ca.firstvoices.nativeorder.services.NativeOrderComputeService;

/**
 * @author dyona
 */
public class ComputeNativeOrderListener implements EventListener {

    private static final Log log = LogFactory.getLog(ComputeNativeOrderListener.class);

    protected NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

	@Override
    public void handleEvent(Event event) {

        if (!(event.getName().equals(DocumentEventTypes.DOCUMENT_CREATED)) &&
                !(event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE))) {
            return;
        }

        if (!(event.getContext() instanceof DocumentEventContext)) {
            return;
        }
        DocumentEventContext ctx = (DocumentEventContext) event.getContext();
        DocumentModel doc = ctx.getSourceDocument();

        if (doc == null) {
            return;
        }

        // Handle language assets (Words and Phrases)
        if (doc.getType().equals("FVWord") || doc.getType().equals("FVPhrase")) {

            // When modifying, only recompute if dc:title has changed.
            // If custom order modified, change is via service - so skip.
            if (event.getName().equals(DocumentEventTypes.BEFORE_DOC_UPDATE)) {

                Boolean titleModified = false;
                Boolean customOrderModified = false;

                DocumentPart[] docParts = doc.getParts();
                for (DocumentPart docPart : docParts) {
                    Iterator<Property> dirtyChildrenIterator = docPart.getDirtyChildren();

                    while (dirtyChildrenIterator.hasNext()) {
                        Property property = dirtyChildrenIterator.next();
                        String propertyName = property.getField().getName().toString();

                        if (propertyName.equals("dc:title") && property.isDirty()) {
                            titleModified = true;
                        } else if (propertyName.equals("fv:custom_order") && property.isDirty()) {
                            customOrderModified = true;
                        }
                    }
                }

                if (!titleModified || customOrderModified) {
                    return;
                }
            }

            service.computeAssetNativeOrderTranslation(doc);
        }
    }
}
