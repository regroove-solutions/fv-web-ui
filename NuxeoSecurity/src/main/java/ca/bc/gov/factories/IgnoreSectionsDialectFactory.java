package ca.bc.gov.factories;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.platform.content.template.factories.SimpleTemplateBasedFactory;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

/**
 * @author dyona
 */
public class IgnoreSectionsDialectFactory extends SimpleTemplateBasedFactory {

    @Override
    public void createContentStructure(DocumentModel eventDoc) {

        PublisherService ps = Framework.getLocalService(PublisherService.class);
        DocumentModelList sectionRoots = ps.getRootSectionFinder(eventDoc.getCoreSession()).getDefaultSectionRoots(true, true);

        // Only apply to one type
        if ("FVDialect".equals(eventDoc.getType())) {
            for (DocumentModel sectionRoot : sectionRoots ) {
                // If trying to create within a publishing area, suppress structured template
                if (sectionRoot.getPath().isPrefixOf(eventDoc.getPath())) {
                    return;
                }
            }
        }

        super.createContentStructure(eventDoc);
    }

}
