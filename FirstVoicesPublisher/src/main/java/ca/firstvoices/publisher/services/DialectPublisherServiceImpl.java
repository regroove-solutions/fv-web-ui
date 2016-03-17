/**
 * 
 */
package ca.firstvoices.publisher.services;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;

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

    protected Map<String, DocumentModel> getAncestors(DocumentModel model) {
        if (model == null || !model.getDocumentType().getName().equals("FVDialect")) {
            throw new InvalidParameterException("Document must be a FVDialect type");
        }
        Map<String, DocumentModel> map = new HashMap<String, DocumentModel>();
        CoreSession session = model.getCoreSession();
        DocumentModel language = session.getDocument(model.getParentRef());
        if (language == null || !language.getDocumentType().getName().equals("FVLanguage")) {
            throw new InvalidParameterException("Parent document must be a FVLanguage type");
        }
        map.put("Language", language);
        DocumentModel languageFamily = session.getDocument(language.getParentRef());
        if (languageFamily == null || !languageFamily.getDocumentType().getName().equals("FVLanguageFamily")) {
            throw new InvalidParameterException("Parent document must be a FVLanguageFamily type");
        }
        map.put("LanguageFamily", languageFamily);
        return map;
    }
    @Override
    public void publish(DocumentModel dialect) {
        // Arguments checks : need to be a FVDialect in a normal tree (LanguageFamily/Language/Dialect)
        Map<String, DocumentModel> ancestors = getAncestors(dialect);

        DocumentModel languageFamily = ancestors.get("LanguageFamily");
        DocumentModel language = ancestors.get("Language");
        CoreSession session = dialect.getCoreSession();

        DocumentModel section = getRootSection(dialect);
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

    private DocumentModel getRootSection(DocumentModel doc) {
       DocumentModel workspace = doc;
       CoreSession session = doc.getCoreSession();
       while (workspace != null && !"Workspace".equals(workspace.getType())) {
           workspace = session.getParentDocument(workspace.getRef());
       }
       DocumentModelList roots = null;
       if (workspace != null) {
           roots = publisherService.getRootSectionFinder(session).getSectionRootsForWorkspace(workspace);
       }
       if (roots == null || roots.size() == 0) {
           roots = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true);
       }
       if (roots.size() == 0) {
            throw new RuntimeException("Can't publish, no section available");
       }
       return roots.get(0);
    }

    @Override
    public void unpublish(DocumentModel dialect) {
        // Arguments checks : need to be a FVDialect in a normal tree (LanguageFamily/Language/Dialect)
        Map<String, DocumentModel> ancestors = getAncestors(dialect);
        DocumentModel languageFamily = ancestors.get("LanguageFamily");
        DocumentModel language = ancestors.get("Language");
        DocumentModel languageSection;
        DocumentModel languageFamilySection;
        CoreSession session = dialect.getCoreSession();
        DocumentModel section = getRootSection(dialect);
        section = session.getChild(section.getRef(), languageFamily.getName());
        if (section == null) {
            throw new InvalidParameterException("Dialect is not published");
        }
        languageFamilySection = section;
        section = session.getChild(section.getRef(), language.getName());
        if (section == null) {
            throw new InvalidParameterException("Dialect is not published");
        }
        languageSection = section;
        section = session.getChild(section.getRef(), dialect.getName());
        if (section == null) {
            throw new InvalidParameterException("Dialect is not published");
        }
        session.removeDocument(section.getRef());
        if (session.getChildren(languageSection.getRef()).size() == 0) {
            session.removeDocument(languageSection.getRef());
        }
        if (session.getChildren(languageFamilySection.getRef()).size() == 0) {
            session.removeDocument(languageFamilySection.getRef());
        }
    }
}
