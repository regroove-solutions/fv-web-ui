/**
 * Update the references documents to proxied one on the proxy
 */

package ca.firstvoices.publisher.listeners;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.publisher.api.PublicationTree;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;


/**
 * @author loopingz
 */
public class ProxyPublishedListener implements EventListener {

    private static final Log log = LogFactory.getLog(ProxyPublishedListener.class);

    protected PublisherService ps = Framework.getService(PublisherService.class);

    public void handleEvent(Event event) {
        EventContext ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext)) {
            return;
        }
        DocumentModel doc = ((DocumentEventContext) ctx).getSourceDocument();
        if (doc == null) {
            return;
        }
        String type = doc.getType();
        if ("FVWord".equals(type) || "FVPhrase".equals(type)) {
            // TODO Do the proxies for the related objects and save them
            process(doc);
        }
    }

    /**
     * @param doc document to check published versions for.
     * @return {@code true} if document has ANY published version; {@code false} otherwise
     */
    protected DocumentModel getPublication(CoreSession session, DocumentRef docRef) {
        DocumentModelList sections = session.getProxies(docRef, null);

        if (!sections.isEmpty()) {
            return sections.get(0);
        }

        return null;
    }

    /**
     * Method finds a section to publish to based on the document TODO: Ensure this is a little more intelligent than
     * selecting the first section found.
     * 
     * @param doc
     * @return section to publish to or {@code null}
     */
    protected DocumentModel getSectionToPublishTo(DocumentModel doc, PublicationTree tree) {

        DocumentModelList sections = doc.getCoreSession().getProxies(doc.getRef(), null);

        for (DocumentModel section : sections) {
            // Ensure section is within the publication target
            if (section.getPath().toString().indexOf(tree.getPath()) == 0) {
                return section;
            }
        }

        return null;
    }

    public DocumentModel process(DocumentModel input) {
        CoreSession session = input.getCoreSession();

        Map<String, String> dependencies = new HashMap<String, String>();

        dependencies.put("fvcore:related_audio", "fvproxy:proxied_audio");
        dependencies.put("fvcore:related_pictures", "fvproxy:proxied_pictures");
        dependencies.put("fvcore:related_videos", "fvproxy:proxied_videos");
        dependencies.put("fvcore:source", "fvproxy:proxied_source");
        dependencies.put("fv-word:categories", "fvproxy:proxied_categories");
        dependencies.put("fv-word:related_phrases", "fvproxy:proxied_phrases");

        for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {
            
            String dependency = dependencyEntry.getKey();
            // Check if input has schema
            if (!input.hasSchema(dependency.split(":")[0])) {
                continue;
            }

            // Publish dependency
            // String documentPath = input.getPathAsString();
            String[] dependencyPropertyValue = (String[]) input.getPropertyValue(dependency);

            if (dependencyPropertyValue == null || dependencyPropertyValue.length == 0) {
                continue;
            }

            // input is the document in the section
            for (String relatedDocUUID : dependencyPropertyValue) {
                IdRef dependencyRef = new IdRef(relatedDocUUID);
                DocumentModel publishedDep = getPublication(session, dependencyRef);
                
                // If dependency published, no need to republish
                if (publishedDep == null) {
                    DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
                    DocumentModel parentDependencySection;
                    if ("FVCategory".equals(dependencyDocModel.getType())) {
                        // Specific behavior
                        // Get all parents
                        DocumentModelList parents = new DocumentModelListImpl();
                        parents.add(dependencyDocModel);
                        DocumentModel parent = session.getDocument(dependencyDocModel.getParentRef());
                        while (parent != null && "FVCategory".equals(parent.getType())) {
                            parents.add(parent);
                            parent = session.getDocument(parent.getParentRef());
                        }
                        Object[] docs = parents.toArray();
                        for (int i = docs.length - 1; i >= 0; i--) {
                            parentDependencySection = getPublication(session, ((DocumentModel) docs[i]).getRef());
                            if (parentDependencySection == null) {
                                parentDependencySection = getPublication(session, ((DocumentModel) docs[i]).getParentRef());
                                parentDependencySection = session.publishDocument(((DocumentModel) docs[i]), parentDependencySection, true);
                            }
                            if (i == 0) {
                                publishedDep = parentDependencySection;
                            }
                        }
                    } else {
                        parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
                        publishedDep = session.publishDocument(dependencyDocModel, parentDependencySection, true);
                    }
                }
                if (publishedDep == null) {
                    continue;
                }
                String[] property = (String[]) input.getPropertyValue(dependencyEntry.getValue());
                String[] updatedProperty = Arrays.copyOf(property, property.length+1);
                updatedProperty[updatedProperty.length-1]=publishedDep.getRef().toString();
                input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
            }
        }
        session.saveDocument(input);
        session.save();
        return input;
    }
}
