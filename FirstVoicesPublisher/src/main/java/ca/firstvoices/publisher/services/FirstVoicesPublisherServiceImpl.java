/**
 *
 */
package ca.firstvoices.publisher.services;

import java.security.InvalidParameterException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.services.AbstractService;

/**
 * @author loopingz
 */
public class FirstVoicesPublisherServiceImpl extends AbstractService implements FirstVoicesPublisherService {

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
    public DocumentModel publishDialect(DocumentModel dialect) {
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
        // Need to republish all assets that were published
        for (DocumentModel child : session.query("SELECT * FROM Document WHERE ecm:ancestorId = '" + dialect.getId() + "' AND ecm:currentLifeCycleState='Published'")) {
            publishAsset(child);
        }
        return section;
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
    public void unpublishDialect(DocumentModel dialect) {
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

    private DocumentModel publishDocument(CoreSession session, DocumentModel doc, DocumentModel section) {
        DocumentModel proxy = session.publishDocument(doc, section, true);
        if ("fv-lifecycle".equals(doc.getLifeCyclePolicy()) && !"Published".equals(doc.getCurrentLifeCycleState())) {
            doc.followTransition("Publish");
        }
        return proxy;
    }

    @Override
    public DocumentModel publishAsset(DocumentModel asset) {
        CoreSession session = asset.getCoreSession();

        DocumentModel dialect = getDialect(asset);
        if (dialect == null) {
            throw new InvalidParameterException("Asset should be inside a dialect");
        }
        DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
        if (proxies.size() == 0) {
            throw new InvalidParameterException("Dialect should be published");
        }
        DocumentModel dialectSection = proxies.get(0);
        DocumentModel input = getPublication(session, asset.getRef());
        if (input != null) {
            // Already published
            return input;
        }

		input = publishDocument(session, asset, getPublication(session, asset.getParentRef()));

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
                                parentDependencySection = getPublication(session,
                                        ((DocumentModel) docs[i]).getParentRef());
                                parentDependencySection = publishDocument(session, ((DocumentModel) docs[i]), parentDependencySection);
                            }
                            if (i == 0) {
                                publishedDep = parentDependencySection;
                            }
                        }
                    } else {
                        parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
                        publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
                    }
                }
                if (publishedDep == null) {
                    continue;
                }
                String[] property = (String[]) input.getPropertyValue(dependencyEntry.getValue());

                String[] updatedProperty = new String[1];

                if (property != null) {
                    updatedProperty = Arrays.copyOf(property, property.length + 1);
                    updatedProperty[updatedProperty.length - 1] = publishedDep.getRef().toString();
                } else {
                	updatedProperty[0] = publishedDep.getRef().toString();
                }

                input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
            }
        }
        session.saveDocument(input);
        return input;
    }

    public DocumentModel republishAsset(DocumentModel asset) {
        CoreSession session = asset.getCoreSession();

        DocumentModel dialect = getDialect(asset);
        if (dialect == null) {
            throw new InvalidParameterException("Asset should be inside a dialect");
        }
        DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
        if (proxies.size() == 0) {
            throw new InvalidParameterException("Dialect should be published");
        }
        DocumentModel dialectSection = proxies.get(0);
        DocumentModel input = getPublication(session, asset.getRef());

        // Always publish changes
    	input = publishDocument(session, asset, getPublication(session, asset.getParentRef()));

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
            if (!asset.hasSchema(dependency.split(":")[0])) {
                continue;
            }

            // Publish dependency
            // String documentPath = input.getPathAsString();
            String[] dependencyPropertyValue = (String[]) asset.getPropertyValue(dependency);

            if (dependencyPropertyValue == null || dependencyPropertyValue.length == 0) {
                continue;
            }

            input.setPropertyValue(dependencyEntry.getValue(), null);

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
                                parentDependencySection = getPublication(session,
                                        ((DocumentModel) docs[i]).getParentRef());
                                parentDependencySection = publishDocument(session, ((DocumentModel) docs[i]), parentDependencySection);
                            }
                            if (i == 0) {
                                publishedDep = parentDependencySection;
                            }
                        }
                    } else {
                        parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
                        publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
                    }
                }

                String[] property = (String[]) input.getPropertyValue(dependencyEntry.getValue());

                String[] updatedProperty = new String[1];

                if (property != null) {
                    updatedProperty = Arrays.copyOf(property, property.length + 1);
                    updatedProperty[updatedProperty.length - 1] = publishedDep.getRef().toString();
                } else {
                	updatedProperty[0] = publishedDep.getRef().toString();
                }

                input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
            }
        }
        session.saveDocument(input);
        return input;
    }

    @Override
    public void unpublishAsset(DocumentModel asset) {
        DocumentModel proxy = getPublication(asset.getCoreSession(), asset.getRef());
        if (proxy == null) {
            return;
        }
        asset.getCoreSession().removeDocument(proxy.getRef());
    }

    protected DocumentModel getPublication(CoreSession session, DocumentRef docRef) {
        DocumentModelList sections = session.getProxies(docRef, null);

        if (!sections.isEmpty()) {
            return sections.get(0);
        }

        return null;
    }

    @Override
    public void unpublish(DocumentModel doc) {
        if (doc == null) {
            return;
        }
        if ("FVDialect".equals(doc.getType())) {
            unpublishDialect(doc);
        } else if (isAssetType(doc.getType())) {
            unpublishAsset(doc);
        }
    }

    private boolean isAssetType(String type) {
        return "FVBookEntry".equals(type) || "FVBook".equals(type) || "FVPhrase".equals(type) || "FVWord".equals(type) || "FVPicture".equals(type) || "FVVideo".equals(type) || "FVAudio".equals(type);
    }

    @Override
    public DocumentModel publish(DocumentModel doc) {
        if (doc == null) {
            return null;
        }
        if ("FVDialect".equals(doc.getType())) {
            return publishDialect(doc);
        }
        else if ("FVPortal".equals(doc.getType())) {
        	return publishPortalAssets(doc);
        }
        else if (isAssetType(doc.getType())) {
            return publishAsset(doc);
        }
        return null;
    }

    @Override
    public DocumentModel republish(DocumentModel doc) {
        if (doc == null) {
            return null;
        }

        if (isAssetType(doc.getType())) {
            return republishAsset(doc);
        } else if ("FVPortal".equals(doc.getType())) {
        	return publishPortalAssets(doc);
        }

        return null;
    }

	@Override
	public DocumentModel publishPortalAssets(DocumentModel portal) {
        CoreSession session = portal.getCoreSession();

        DocumentModel dialect = getDialect(portal);
        if (dialect == null) {
            throw new InvalidParameterException("Asset should be inside a dialect");
        }
        DocumentModelList proxies = session.getProxies(dialect.getRef(), null);
        if (proxies.size() == 0) {
            throw new InvalidParameterException("Dialect should be published");
        }
        DocumentModel dialectSection = proxies.get(0);
        DocumentModel input = getPublication(session, portal.getRef());

        // Portal should always be published at this point, skip if not
        //if (input == null) {
            // Already published
        //    return input;
        //}

        // Publish changes
        session.publishDocument(portal, dialectSection, true);

        Map<String, String> dependencies = new HashMap<String, String>();

        // Portal
        dependencies.put("fv-portal:featured_words", "fvproxy:proxied_words");
        dependencies.put("fv-portal:background_top_image", "fvproxy:proxied_background_image");
        dependencies.put("fv-portal:featured_audio", "fvproxy:proxied_featured_audio");
        dependencies.put("fv-portal:logo", "fvproxy:proxied_logo");
        dependencies.put("fv-portal:related_links", "fvproxy:proxied_related_links");

        for (Entry<String, String> dependencyEntry : dependencies.entrySet()) {

            String dependency = dependencyEntry.getKey();
            // Check if input has schema
            if (!input.hasSchema(dependency.split(":")[0])) {
                continue;
            }

            String[] dependencyPropertyValue;

            // Handle expection property values as arrays
            if (dependencyEntry.getKey() == "fv-portal:featured_words" || dependencyEntry.getKey() == "fv-portal:related_links") {
                dependencyPropertyValue = (String[]) input.getPropertyValue(dependency);
            }
            // Handle as string
            else {
            	dependencyPropertyValue = new String[1];
            	String propertyValue = (String) input.getPropertyValue(dependency);

            	if (propertyValue != null) {
					dependencyPropertyValue[0] = propertyValue;
				}
            }

            if (dependencyPropertyValue == null || dependencyPropertyValue.length == 0) {
                continue;
            }

            // input is the document in the section
            for (String relatedDocUUID : dependencyPropertyValue) {
                IdRef dependencyRef = new IdRef(relatedDocUUID);
                DocumentModel publishedDep = getPublication(session, dependencyRef);

                try {
                	// TODO: Bug? getProxies seems to return documents that don't exist anymore. Force check to see if doc exists.
                	session.getDocument(publishedDep.getRef());
                } catch (NullPointerException | DocumentNotFoundException e) {
                	publishedDep = null;
                }

                // If dependency isn't published, needs publishing
                if (publishedDep == null) {
                    DocumentModel dependencyDocModel = session.getDocument(dependencyRef);
                    DocumentModel parentDependencySection;

                    parentDependencySection = getPublication(session, dependencyDocModel.getParentRef());
                    publishedDep = publishDocument(session, dependencyDocModel, parentDependencySection);
                }

                // Handle exception property values as arrays
                if (dependencyEntry.getKey() == "fv-portal:featured_words" || dependencyEntry.getKey() == "fv-portal:related_links") {
                    String[] property = (String[]) input.getPropertyValue(dependencyEntry.getValue());
                    String[] updatedProperty = Arrays.copyOf(property, property.length + 1);
                    updatedProperty[updatedProperty.length - 1] = publishedDep.getRef().toString();
                	input.setPropertyValue(dependencyEntry.getValue(), updatedProperty);
                }
                // Handle as string
                else {
                	input.setPropertyValue(dependencyEntry.getValue(), publishedDep.getRef().toString());
                }
            }
        }
        session.saveDocument(input);
        return input;
	}
}
