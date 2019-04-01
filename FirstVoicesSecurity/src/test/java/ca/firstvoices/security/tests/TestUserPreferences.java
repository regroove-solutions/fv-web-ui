package ca.firstvoices.security.tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.FIRSTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.LASTNAME_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.USERNAME_COLUMN;

import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;

import ca.firstvoices.seam.FVLogin;
import ca.firstvoices.utils.FVUserPreferencesSetup;

@RunWith(FeaturesRunner.class)
@Features({ PlatformFeature.class })
@Deploy({ "FVUserRegistration:OSGI-INF/extensions/ca.firstvoices.user.xml", "org.nuxeo.ecm.user.registration",
        "org.nuxeo.ecm.user.registration.web:OSGI-INF/user-registration-contrib.xml", "org.nuxeo.ecm.user.invite" })
@PartialDeploy(bundle = "studio.extensions.First-Voices", extensions = { TargetExtensions.ContentModel.class })
public class TestUserPreferences {

    @Inject
    protected CoreSession session;

    @Inject
    protected UserManager userManager;

    DocumentModel dialectDoc;

    @Before
    public void setUp() throws Exception {
        session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));

        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
        dialectDoc = session.saveDocument(dialectDoc);
        assertNotNull(dialectDoc);

    }

    @Test
    public void testRedirectionOnUserPreferences() {
        // create a User
        DocumentModel testUser = createUserWithPassword("test@test.com", "Test", "X", "members");
        assertNotNull(testUser);

        // test redirection when user doe not have preferences set up
        String redirectionUrl = FVLogin.getDefaultDialect(session, userManager.getPrincipal("test@test.com"));
        assertNull(redirectionUrl);

        // add a dialect but the dialect does not have a short url
        String json = new FVUserPreferencesSetup().createDefaultUserPreferencesWithDialectID(dialectDoc.getId());
        assertNotNull(json);
        assertEquals(String.format(
                "{\"General\":{\"primary_dialect\":\"%s\"},\"Navigation\":{\"start_page\":\"my_dialect\"},"
                        + "\"Theme\":{\"font_size\":\"default\"}}",
                dialectDoc.getId()), json);
        testUser.setPropertyValue("user:preferences", json);
        userManager.updateUser(testUser);
        redirectionUrl = FVLogin.getDefaultDialect(session, userManager.getPrincipal("test@test.com"));

        assertEquals("app/explore/Family/Language/Dialect", redirectionUrl);

        // add a short url on the dialect
        dialectDoc.setPropertyValue("fvdialect:short_url", "dialect");
        dialectDoc = session.saveDocument(dialectDoc);

        redirectionUrl = FVLogin.getDefaultDialect(session, userManager.getPrincipal("test@test.com"));

        assertEquals("app/sections/dialect", redirectionUrl);

    }

    public DocumentModel createUserWithPassword(String email, String lastName, String firstName, String... groups) {
        DocumentModel userModel = userManager.getBareUserModel();
        userModel.setPropertyValue(USERNAME_COLUMN, email);
        userModel.setPropertyValue(LASTNAME_COLUMN, lastName);
        userModel.setPropertyValue(FIRSTNAME_COLUMN, firstName);

        if (StringUtils.isNotBlank(email)) {
            userModel.setPropertyValue(EMAIL_COLUMN, email);
        }

        if (ArrayUtils.isNotEmpty(groups)) {
            userModel.setPropertyValue(GROUPS_COLUMN, groups);
        }

        userModel = userManager.createUser(userModel);
        return userModel;
    }

}
