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
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.LocalDeploy;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.RuntimeFeature;

import ca.firstvoices.publisher.services.DialectPublisherService;

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
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.ProxyPublishedListener.xml"})
public class ProxyPublishedListenerTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected PublisherService publisherService;
    
    @Inject
    protected DialectPublisherService dialectPublisherService;

    private DocumentModel sectionRoot;

    private DocumentModel languageDoc;

    private DocumentModel dialectDoc;

    private DocumentModel familyDoc;

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
        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
    }

    @Test
    public void testDialectPublishing() throws Exception {
        dialectPublisherService.publish(dialectDoc);
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
        dialectPublisherService.publish(dialectDoc);
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 9);
    }
    
    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingWrongDocumentType() throws Exception {
        dialectPublisherService.publish(familyDoc);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingNullDocument() throws Exception {
        dialectPublisherService.publish(null);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingWrongPlace() throws Exception {
        dialectPublisherService.publish(session.createDocument(session.createDocumentModel("/", "Dialect", "FVDialect")));
    }

    @Test
    public void testDocumentPublishing() throws Exception {
       createDialectTree();
       DocumentModel contributor = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Contributors", "myContributor", "FVContributor"));
       DocumentModel picture = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Resources", "myPicture", "FVAudio"));
       DocumentModel audio = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Resources", "myPicture", "FVPicture"));
       DocumentModel video = session.createDocument(session.createDocumentModel("/Family/Language/Dialect/Resources", "myVideo", "FVVideo"));
       DocumentModel doc = session.createDocumentModel("/Family/Language/Dialect/Dictionary", "myWord", "FVWord");
       String[] values = new String[1];
       values[0]=audio.getId();
       doc.setPropertyValue("fvcore:related_audio", values);
       values[0]=picture.getId();
       doc.setPropertyValue("fvcore:related_pictures", values);
       values[0]=video.getId();
       doc.setPropertyValue("fvcore:related_videos", values);
       values[0]=contributor.getId();
       doc.setPropertyValue("fvcore:source", values);
       doc = session.createDocument(doc);
       
       DocumentModel proxy = session.publishDocument(doc, sectionRoot);
       assertTrue(proxy.hasSchema("fvproxy"));
       assertFalse(doc.hasSchema("fvproxy"));
    }
}