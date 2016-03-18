/**
 * 
 */

package ca.firstvoices.listeners;

import static org.junit.Assert.*;

import java.security.InvalidParameterException;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.LocalDeploy;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.RuntimeFeature;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.publisher.services.FirstVoicesPublisherServiceImpl;

import javax.inject.Inject;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, PlatformFeature.class})
@Deploy({"studio.extensions.First-Voices", "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml"})
@LocalDeploy({"FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.ProxyPublisherListener.xml"})
public class FirstVoicesPublisherTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected PublisherService publisherService;

    private DocumentModel sectionRoot;

    private DocumentModel languageDoc;

    private DocumentModel dialectDoc;

    private DocumentModel familyDoc;

    private DocumentModel dialect2Doc;

    private DocumentModel language2Doc;

    private DocumentModel dialect3Doc;

    @Inject
    protected FirstVoicesPublisherService dialectPublisherService;

    private DocumentModel category;

    private DocumentModel subcategory;

    private DocumentModel contributor2;

    private DocumentModel contributor;

    private DocumentModel picture;

    private DocumentModel audio;

    private DocumentModel video;

    private DocumentModel word;

    @Before
    public void setUp() throws Exception {
        DocumentModel domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        sectionRoot = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true).get(0);
        createDialectTree();
    }

    @Test
    public void testDialectFactory() throws Exception {
        DocumentModel dialect = dialectDoc;
        // Check the factory is doing its job - check template
        DocumentModel child = session.getChild(dialect.getRef(), "Contributors");
        assertNotNull(child);
        assertEquals("FVContributors", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Dictionary");
        assertNotNull(child);
        assertEquals("FVDictionary", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Forum");
        assertNotNull(child);
        assertEquals("Forum", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Portal");
        assertNotNull(child);
        assertEquals("FVPortal", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Alphabet");
        assertNotNull(child);
        assertEquals("FVAlphabet", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Resources");
        assertNotNull(child);
        assertEquals("FVResources", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Categories");
        assertNotNull(child);
        assertEquals("FVCategories", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Links");
        assertNotNull(child);
        assertEquals("FVLinks", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Stories & Songs");
        assertNotNull(child);
        assertEquals("FVBooks", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Phrase Books");
        assertNotNull(child);
        assertEquals("FVCategories", child.getDocumentType().getName());
        
        // Check if Dialect is created in a section then it has no template applied
        dialect = session.createDocument(session.createDocumentModel(sectionRoot.getPathAsString(), "Dialect", "FVDialect"));
        assertEquals("Should have no child", 0, session.getChildren(dialect.getRef()).size());
    }

    protected void createDialectTree() throws Exception {
        familyDoc = session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        languageDoc = session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        language2Doc = session.createDocument(session.createDocumentModel("/Family", "Language2", "FVLanguage"));
        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
        dialect2Doc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect2", "FVDialect"));
        dialect3Doc = session.createDocument(session.createDocumentModel("/Family/Language2", "Dialect", "FVDialect"));
        dialectDoc.followTransition("Enable");
        dialect2Doc.followTransition("Enable");
        dialect3Doc.followTransition("Enable");
    }

    @Test
    public void testDialectPublishing() throws Exception {
        // Publishing dialect
        session.followTransition(dialectDoc, "Publish");
        DocumentModel section = sectionRoot;
        // Data and SharedData are by default inside section
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertNotNull(section);
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertNotNull(section);
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertNotNull(section);
        assertEquals(session.getChildren(section.getRef()).size(), 9);

        // Check that none is duplicated if we publish again
        dialectPublisherService.publishDialect(dialectDoc);
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 9);
        
        // Check that none is duplicated if we publish again
        session.followTransition(dialect2Doc, "Publish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(2, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialect2Doc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 9);
        
        // Check that none is duplicated if we publish again
        session.followTransition(dialect3Doc, "Publish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(2, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), language2Doc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialect3Doc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 9);
        
        // Test unpublish
        session.followTransition(dialect2Doc, "Unpublish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(2, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 9);
        
        // Test unpublish
        session.followTransition(dialectDoc, "Unpublish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        Boolean notFound = false;
        try {
            section = session.getChild(section.getRef(), languageDoc.getName());
        } catch (DocumentNotFoundException e) {
            notFound = true;
        }
        assertTrue(notFound);
        
        // Test unpublish
        session.followTransition(dialect3Doc, "Unpublish");
        section = sectionRoot;
        assertEquals(2, session.getChildren(section.getRef()).size());
        notFound = false;
        try {
            section = session.getChild(section.getRef(), familyDoc.getName());
        } catch (DocumentNotFoundException e) {
            notFound = true;
        }
        assertTrue(notFound);
    }
    
    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingWrongDocumentType() throws Exception {
        dialectPublisherService.publishDialect(familyDoc);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingNullDocument() throws Exception {
        dialectPublisherService.publishDialect(null);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingWrongPlace() throws Exception {
        dialectPublisherService.publishDialect(session.createDocument(session.createDocumentModel("/", "Dialect", "FVDialect")));
    }

    private void createWord() {
        category = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Categories", "Category", "FVCategory"));
        subcategory = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Categories/Category", "SubCategory", "FVCategory"));
        contributor = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Contributors", "myContributor", "FVContributor"));
        contributor2 = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Contributors", "myContributor2", "FVContributor"));
        picture = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Resources", "myPicture", "FVPicture"));
        audio = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Resources", "myAudio", "FVAudio"));
        video = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Resources", "myVideo", "FVVideo"));
        word = session.createDocumentModel("/Family/Language/Dialect/Dictionary", "myWord", "FVWord");
        String[] values = new String[1];
        values[0]=audio.getId();
        word.setPropertyValue("fvcore:related_audio", values);
        values = new String[1];
        values[0]=picture.getId();
        word.setPropertyValue("fvcore:related_pictures", values);
        values = new String[1];
        values[0]=video.getId();
        word.setPropertyValue("fvcore:related_videos", values);
        values = new String[1];
        values[0]=subcategory.getId();
        word.setPropertyValue("fv-word:categories", values);
        values = new String[2];
        values[0]=contributor.getId();
        values[1]=contributor2.getId();
        word.setPropertyValue("fvcore:source", values);
        word = session.createDocument(word);
    }

    private DocumentModel getProxy(DocumentModel model) {
        return session.getProxies(model.getRef(), null).get(0);
    }

    @Test
    public void testDocumentPublishing() throws Exception {
       // Create a word 
       createWord();
       session.followTransition(dialectDoc, "Publish");
       session.followTransition(word, "Publish");
       // Not nice to have all parameters
       verifyProxy(getProxy(word));
    }
    
    @Test
    public void testDocumentRepublishing() throws Exception {
        createWord();
        session.followTransition(dialectDoc, "Publish");
        session.followTransition(word, "Publish");
        verifyProxy(getProxy(word));
        session.followTransition(dialectDoc, "Unpublish");
        assertEquals(0, session.getProxies(word.getRef(), null).size());
        session.followTransition(dialectDoc, "Publish");
        verifyProxy(getProxy(word));
    }
    
    @Test(expected = InvalidParameterException.class)
    public void testDocumentPublishingOnUnpublishedDialect() {
        createWord();
        dialectPublisherService.publish(word);
    }

    private void verifyProxy(DocumentModel proxy) {
     // Check the schema is added
        DocumentModel doc;
        assertTrue(proxy.hasSchema("fvproxy"));
        assertFalse(word.hasSchema("fvproxy"));
        // Check that the property has been set correctly
        verifyProxiedResource(proxy, audio, "fvproxy:proxied_audio");
        verifyProxiedResource(proxy, video, "fvproxy:proxied_videos");
        verifyProxiedResource(proxy, picture, "fvproxy:proxied_pictures");
        // Specific source as there is 2 items
        String[] property = (String[]) proxy.getPropertyValue("fvproxy:proxied_source");
        assertEquals(2, property.length);
        assertNotEquals(contributor.getRef(), new IdRef(property[0]));
        doc = session.getDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString().matches("/FV.*/sections/Family/Language/Dialect/Contributors/myContributor"));
        doc = session.getSourceDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString().matches("/Family/Language/Dialect/Contributors/myContributor"));
        assertEquals(contributor.getRef().toString(), doc.getSourceId());
        assertNotEquals(contributor2.getRef(), new IdRef(property[1]));
        doc = session.getDocument(new IdRef(property[1]));
        assertTrue(doc.getPathAsString().matches("/FV.*/sections/Family/Language/Dialect/Contributors/myContributor2"));
        doc = session.getSourceDocument(new IdRef(property[1]));
        assertTrue(doc.getPathAsString().matches("/Family/Language/Dialect/Contributors/myContributor2"));
        assertEquals(contributor2.getRef().toString(), doc.getSourceId());
        property = (String[]) proxy.getPropertyValue("fvproxy:proxied_categories");
        assertEquals(1, property.length);
        assertNotEquals(subcategory.getRef(), new IdRef(property[0]));
        doc = session.getDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString().matches("/FV.*/sections/Family/Language/Dialect/Categories/Category/SubCategory"));
        doc = session.getSourceDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString().matches("/Family/Language/Dialect/Categories/Category/SubCategory"));
    }
    private void verifyProxiedResource(DocumentModel proxy, DocumentModel original, String propertyName) {
        String[] property = (String[]) proxy.getPropertyValue(propertyName);
        assertEquals(1, property.length);
        IdRef ref = new IdRef(property[0]);
        assertNotEquals(original.getRef(), ref);
        DocumentModel doc = session.getDocument(ref);
        assertTrue(doc.getPathAsString().matches("/FV.*/sections/Family/Language/Dialect/Resources/" + original.getName()));
        doc = session.getSourceDocument(ref);
        assertTrue(doc.getPathAsString().matches("/Family/Language/Dialect/Resources/" + original.getName()));
        assertEquals(original.getRef().toString(), doc.getSourceId());
    }
}