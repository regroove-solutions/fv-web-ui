package ca.firstvoices.seam;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.faces.context.FacesContext;

import org.apache.catalina.util.URLEncoder;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.Begin;
import org.jboss.seam.annotations.Install;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.ecm.webapp.helpers.StartupHelper;
import org.nuxeo.runtime.api.Framework;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.firstvoices.models.CustomPreferencesObject;
import ca.firstvoices.utils.FVLoginUtils;

@Name("startupHelper")
@Scope(ScopeType.SESSION)
@Install(precedence = Install.DEPLOYMENT)
public class FVLogin extends StartupHelper {
    private static final long serialVersionUID = 1L;

    private static final Log log = LogFactory.getLog(FVLogin.class);

    // this is configured with a property to be set easily in nuxeo.conf in different envs
    static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

    @Override
    @Begin(id = "#{conversationIdGenerator.nextMainConversationId}", join = true)
    public String initDomainAndFindStartupPage(String domainTitle, String viewId) {
        if (documentManager == null) {
            super.initServerAndFindStartupPage();
        }

        String NUXEO_URL = restHelper.getBaseURL();
        if (StringUtils.isEmpty(fvContextPath)) {
            // if we don't serve /app we don;t need /nuxeo in the url either
            NUXEO_URL = restHelper.getBaseURL().replaceAll(restHelper.getContextPath(), "");

        }
        String redirectTo = (NUXEO_URL + fvContextPath).endsWith("/") ? (NUXEO_URL + fvContextPath)
                : (NUXEO_URL + fvContextPath) + "/";
        String backToPath = RestHelper.getHttpServletRequest().getParameter("backTo");

        NuxeoPrincipal currentUser = documentManager.getPrincipal();
        if (currentUser.isAdministrator()) {

            return "view_home";
        }
        if (!currentUser.isAnonymous()) {
            if (validatePath(backToPath)) {
                redirectTo = NUXEO_URL + backToPath;
            }
            // Otherwise, send to default dialect
            else {
                String dialect = getDefaultDialect(documentManager, currentUser);

                redirectTo = Arrays.asList(NUXEO_URL, dialect == null ? fvContextPath : dialect)
                                   .stream()
                                   .map(s -> ((s != null && s.endsWith("/"))) ? s.substring(0, s.length() - 1) : s)
                                   .map(s -> ((s != null && s.startsWith("/"))) ? s.substring(1) : s)
                                   .collect(Collectors.joining("/"));

            }
        }
        try {
            FacesContext.getCurrentInstance().getExternalContext().redirect(getURIFromPath(redirectTo));
        } catch (URISyntaxException | IOException e) {
            log.error(e);
        }
        return null;
    }

    public static String getURIFromPath(String redirectTo) throws URISyntaxException, UnsupportedEncodingException {
        redirectTo = URLEncoder.DEFAULT.encode(redirectTo, Charset.availableCharsets().get("UTF-8"));
        return new URI(redirectTo).toASCIIString();
    }

    public static String getDefaultDialect(CoreSession documentManager, NuxeoPrincipal currentUser) {
        String primary_dialect_path = null;
        String primary_dialect_short_url = null;
        String userPreferences = (String) currentUser.getModel().getPropertyValue("user:preferences");

        if (currentUser.isAnonymous()) {
            return null;
        }

        // Lookup dialect in default preferences
        if (userPreferences != null) {
            DocumentModel dialect = null;

            CustomPreferencesObject userPreferencesSettings;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
                userPreferencesSettings = objectMapper.readValue(userPreferences,
                        new TypeReference<CustomPreferencesObject>() {
                        });
            } catch (IOException e) {
                log.error(e);
                return null;
            }

            String primary_dialect_obj = (String) userPreferencesSettings.getGeneralPreferences()
                                                                         .get("primary_dialect");
            if (primary_dialect_obj != null && documentManager.exists(new IdRef(primary_dialect_obj))) {
                // MC-Nuxeo : I see that new inviated users don't have acess to this document even if the dialect its
                // set in theire preferences
                dialect = documentManager.getDocument(new IdRef(primary_dialect_obj));
            }

            if (dialect != null) {
                primary_dialect_short_url = (String) dialect.getPropertyValue("fvdialect:short_url");
                primary_dialect_path = dialect.getPathAsString();
            }
        }

        // Find first dialect user is member of...
        else {
            DocumentModelList dialects = FVLoginUtils.getDialectsForUser(currentUser, documentManager);
            // MC-Nuxeo: fvdialect:short_url is always null; where is this set?
            if (dialects.size() > 0) {
                primary_dialect_short_url = (String) dialects.get(0).getPropertyValue("fvdialect:short_url");
                primary_dialect_path = dialects.get(0).getPathAsString();
            }
        }

        String finalPath = null;

        if (primary_dialect_short_url != null && !primary_dialect_short_url.isEmpty()) {
            // Users who are global 'members' should just go to the Sections URL
            if (currentUser.getGroups().contains("members")) {
                finalPath = fvContextPath + "/sections/" + primary_dialect_short_url;
            }
            // Other users can go to Workspaces
            else {
                finalPath = fvContextPath + "/Workspaces/" + primary_dialect_short_url;
            }
        } else if (primary_dialect_path != null) {
            // must encode only Dialect..
            finalPath = fvContextPath + "/explore" + primary_dialect_path;
        }

        return finalPath;
    }

    private boolean validatePath(String path) {
        String URL_REGEX = "^((%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)" + "([).!';/?:,][[:blank:]])?$";

        Pattern URL_PATTERN = Pattern.compile(URL_REGEX);

        if (path == null || path.isEmpty()) {
            return false;
        }

        Matcher matcher = URL_PATTERN.matcher(path);
        return matcher.matches();
    }
}
