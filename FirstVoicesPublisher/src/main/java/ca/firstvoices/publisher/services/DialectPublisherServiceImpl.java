/**
 * 
 */
package ca.firstvoices.publisher.services;

import java.security.InvalidParameterException;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.model.DefaultComponent;


/**
 * @author loopingz
 *
 */
public class DialectPublisherServiceImpl extends DefaultComponent implements DialectPublisherService {

    private PublisherService publisherService = Framework.getLocalService(PublisherService.class);
    
    private DocumentModel rootSection = null;

    @Override
    public void publish(DocumentModel dialect) {
        // Arguments checks : need to be a FVDialect in a normal tree (LanguageFamily/Language/Dialect)
        if (dialect == null || !dialect.getDocumentType().getName().equals("FVDialect")) {
            throw new InvalidParameterException("Document must be a FVDialect type");
        }
        CoreSession session = dialect.getCoreSession();
        DocumentModel language = session.getDocument(dialect.getParentRef());
        if (language == null || !language.getDocumentType().getName().equals("FVLanguage")) {
            throw new InvalidParameterException("Parent document must be a FVLanguage type");
        }
        DocumentModel languageFamily = session.getDocument(language.getParentRef());
        if (languageFamily == null || !languageFamily.getDocumentType().getName().equals("FVLanguageFamily")) {
            throw new InvalidParameterException("Parent document must be a FVLanguageFamily type");
        }

        DocumentModel section = getRootSection(session);
        // Publish grand parent
        if (!isPublished(languageFamily, section)) {
            session.publishDocument(languageFamily, section);
        }
        // Publish parent
        section = session.getChild(section.getRef(), languageFamily.getName());
        if (!isPublished(language, section)) {
            session.publishDocument(language, section);
        }
        // Publish dialect
        section = session.getChild(section.getRef(), language.getName());
        if (!isPublished(dialect, section)) {
            session.publishDocument(dialect, section);
        }
        // Now publish all the children
        section = session.getChild(section.getRef(), dialect.getName());
        DocumentModelList children = session.getChildren(dialect.getRef());
        for (DocumentModel child : children) {
            if (!child.hasFacet(FacetNames.PUBLISHABLE)) {
                continue;
            }
            if (!isPublished(child, section)) {
                session.publishDocument(child, section);
            }
        }
    }

    private Boolean isPublished(DocumentModel doc, DocumentModel section) {
        return doc.getCoreSession().getProxies(doc.getRef(), section.getRef()).size() != 0;
    }
    private DocumentModel getRootSection(CoreSession session) {
        // Don't need to recompute everytime
        if (rootSection == null) {
            DocumentModelList roots = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true);
            if (roots.size() == 0) {
                throw new RuntimeException("Can't publish, no section available");
            }
            rootSection = roots.get(0);
        }
        return rootSection;
    }
}
