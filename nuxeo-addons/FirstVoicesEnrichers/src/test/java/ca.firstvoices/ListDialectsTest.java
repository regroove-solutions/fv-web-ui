package ca.firstvoices;

import ca.firstvoices.nuxeo.operations.ListDialects;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.*;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

import static ca.firstvoices.nuxeo.operations.ListDialects.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;



@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class } )
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy( {
        "studio.extensions.First-Voices",
        "org.nuxeo.ecm.platform",
        "org.nuxeo.ecm.platform.commandline.executor",
        "org.nuxeo.ecm.automation.core",
        "org.nuxeo.ecm.platform.picture.core",
        "org.nuxeo.ecm.platform.video.core",
        "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting",
        "org.nuxeo.ecm.platform.web.common"
})
@LocalDeploy({
        "FirstVoicesPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
        "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
        "FirstVoicesEnrichers:OSGI-INF/extensions/ca.firstvoices.enrichers.operations.xml",
        "FirstVoicesEnrichers:OSGI-INF/extensions/fake-load-actions.xml",
        "FirstVoicesEnrichers:OSGI-INF/extensions/fake-studio.xml",
        "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
        "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
        "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml",
        "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",

})

public class ListDialectsTest
{
    @Inject
    protected CoreSession session;

    @Inject
    protected AutomationService automationService;

    DocumentModel domain = null;

    DocumentModel dialectDocNew = null;
    DocumentModel dialectDocEnabled = null;
    DocumentModel dialectDocPublished = null;
    DocumentModel dialectDocDisabled = null;
    DocumentModel dialectDocDeleted = null;

    public static final String DIALECT_NEW          = "FVDialect-NEW";
    public static final String DIALECT_ENABLED      = "FVDialect-ENABLED";
    public static final String DIALECT_PUBLISHED    = "FVDialect-PUBLISHED";
    public static final String DIALECT_DISABLED     = "FVDialect-DISABLED";
    public static final String DIALECT_DELETED      = "FVDialect-DELETED";


    DocumentModel languageDoc = null;

    DocumentModel familyDoc = null;

    DocumentModel category = null;

    DocumentModel subcategory = null;

    DocumentModel word = null;

    String categoryQuery = "";

    @Before
    public void setUp() throws Exception {
        session.removeChildren(session.getRootDocument().getRef());
        session.save();

        domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));

        familyDoc = session.createDocument(session.createDocumentModel("/FV", "Family", "FVLanguageFamily"));
        languageDoc = session.createDocument(session.createDocumentModel("/FV/Family", "Language", "FVLanguage"));
        dialectDocNew = session.createDocument(session.createDocumentModel("/FV/Family/Language",           DIALECT_NEW,        "FVDialect" ));
        dialectDocEnabled = session.createDocument(session.createDocumentModel("/FV/Family/Language",       DIALECT_ENABLED,    "FVDialect" ));
        dialectDocPublished = session.createDocument(session.createDocumentModel("/FV/Family/Language",     DIALECT_PUBLISHED,  "FVDialect" ));
        dialectDocDisabled = session.createDocument(session.createDocumentModel("/FV/Family/Language",      DIALECT_DISABLED,   "FVDialect" ));

        dialectDocEnabled.followTransition("Enable");
        session.saveDocument( dialectDocEnabled);
        dialectDocPublished.followTransition("Publish");
        session.saveDocument( dialectDocPublished );
        dialectDocDisabled.followTransition( "Enable");
        session.saveDocument( dialectDocDisabled );
        dialectDocDisabled.followTransition( "Disable");
        session.saveDocument( dialectDocDisabled );

        session.save();
    }

    @Test
    public void checkDialectStates()
    {
        dialectDocNew = session.getDocument( new IdRef(dialectDocNew.getId()));
        assertTrue( "Dialect should be in new state", dialectDocNew.getCurrentLifeCycleState().equals("New"));

        dialectDocEnabled = session.getDocument( new IdRef( dialectDocEnabled.getId()) );
        assertTrue( "Dialect should be in enabled state", dialectDocEnabled.getCurrentLifeCycleState().equals("Enabled"));

        dialectDocPublished = session.getDocument( new IdRef( dialectDocPublished.getId()));
        assertTrue( "Dialect should be in published state", dialectDocPublished.getCurrentLifeCycleState().equals("Published"));

        dialectDocDisabled = session.getDocument( new IdRef( dialectDocDisabled.getId()));
        assertTrue( "Dialect should be in disabled state", dialectDocDisabled.getCurrentLifeCycleState().equals("Disabled"));
    }

    @Test
    public void listAllDialects() throws OperationException
    {
        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("dialectState", ALL_DIALECTS );

        DocumentModelList docs = (DocumentModelList) automationService.run(ctx, ListDialects.ID, params);
        assertEquals(4, docs.size());
    }

    @Test
    public void listNewDialects() throws OperationException
    {
        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("dialectState", NEW_DIALECTS );

        DocumentModelList docs = (DocumentModelList) automationService.run(ctx, ListDialects.ID, params);
        assertEquals(1, docs.size());
    }

    @Test
    public void listDialectsToJoin() throws OperationException
    {
        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("dialectState", DIALECTS_TO_JOIN );

        DocumentModelList docs = (DocumentModelList) automationService.run(ctx, ListDialects.ID, params);
        assertTrue("Should have only 2 dialects as candidates to join", docs.size() == 2);
    }

    @Test
    public void listPublishedDialects() throws OperationException
    {
        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("dialectState", PUBLISHED_DIALECTS );

        DocumentModelList docs = (DocumentModelList) automationService.run(ctx, ListDialects.ID, params);
        assertTrue("Should have only 1 published dialect", docs.size() == 1);
    }

    @Test
    public void listEnabledDialects() throws OperationException
    {
        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("dialectState", ENABLED_DIALECTS );

        DocumentModelList docs = (DocumentModelList) automationService.run(ctx, ListDialects.ID, params);
        assertTrue("Should have only 1 enabled dialect", docs.size() == 1);
    }


    @Test
    public void listDisabledDialects() throws OperationException
    {
        OperationContext ctx = new OperationContext(session);
        Map<String, Object> params = new HashMap<>();

        params.put("dialectState", DISABLED_DIALECTS );

        DocumentModelList docs = (DocumentModelList) automationService.run(ctx, ListDialects.ID, params);
        assertTrue("Should have only 1 disabled dialect", docs.size() == 1);
    }

}