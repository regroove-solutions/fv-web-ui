/**
 * 
 */

package ca.firstvoices.listeners;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.LocalDeploy;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.RuntimeFeature;
import javax.inject.Inject;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, PlatformFeature.class})
@Deploy({"studio.extensions.First-Voices", "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml"})
@LocalDeploy({"FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml"})
public class ProxyPublishedListenerTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected PublisherService publisherService;

    private DocumentModel sectionRoot;

    @Before
    public void setUp() {
        DocumentModel domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        sectionRoot = publisherService.getRootSectionFinder(session).getDefaultSectionRoots(true, true).get(0);
    }

    @Test
    public void testDialectFactory() throws Exception {
        DocumentModel dialect = session.createDocument(session.createDocumentModel("/", "Dialect", "FVDialect"));
        // Check the factory is doing its job - check template
        DocumentModel child = session.getChild(dialect.getRef(), "Contributors");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVContributors");
        child = session.getChild(dialect.getRef(), "Dictionary");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVDictionary");
        child = session.getChild(dialect.getRef(), "Forum");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "Forum");
        child = session.getChild(dialect.getRef(), "Portal");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVPortal");
        child = session.getChild(dialect.getRef(), "Alphabet");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVAlphabet");
        child = session.getChild(dialect.getRef(), "Resources");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVResources");
        child = session.getChild(dialect.getRef(), "Categories");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVCategories");
        child = session.getChild(dialect.getRef(), "Links");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVLinks");
        child = session.getChild(dialect.getRef(), "Stories & Songs");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVBooks");
        child = session.getChild(dialect.getRef(), "Phrase Books");
        assertNotNull(child);
        assertEquals(child.getDocumentType().getName(), "FVCategories");
        // Check if Dialect is created in a section then it has no template applied
        dialect = session.createDocument(session.createDocumentModel(sectionRoot.getPathAsString(), "Dialect", "FVDialect"));
        assertEquals("Should have no child", session.getChildren(dialect.getRef()).size(), 0);
    }

    @Test
    public void testDocumentPublishing() throws Exception {
       DocumentModel dialect = session.createDocument(session.createDocumentModel("/", "Dialect", "FVDialect"));
       DocumentModel contributor = session.createDocument(session.createDocumentModel("/Dialect/Contributors", "myContributor", "FVContributor"));
       DocumentModel picture = session.createDocument(session.createDocumentModel("/Dialect/Resources", "myPicture", "FVAudio"));
       DocumentModel audio = session.createDocument(session.createDocumentModel("/Dialect/Resources", "myPicture", "FVPicture"));
       DocumentModel video = session.createDocument(session.createDocumentModel("/Dialect/Resources", "myVideo", "FVVideo"));
       DocumentModel doc = session.createDocumentModel("/Dialect/Dictionary", "myWord", "FVWord");
       doc.setProperty("fv", "related_pictures", picture.getId());
       doc.setProperty("fv", "related_audio", audio.getId());
       doc.setProperty("fv", "related_videos", video.getId());
       doc.setProperty("fv", "source", contributor.getId());
       doc = session.createDocument(doc);
       
       DocumentModel proxy = session.publishDocument(doc, sectionRoot);
       assertTrue(proxy.hasSchema("fvproxy"));
       assertFalse(doc.hasSchema("fvproxy"));
    }
}