package ca.firstvoices.seam;

import ca.firstvoices.marshallers.CustomPreferencesJSONReader;
import ca.firstvoices.models.CustomPreferencesObject;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.Begin;
import org.jboss.seam.annotations.Install;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.ecm.webapp.helpers.StartupHelper;

import javax.faces.context.FacesContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Name("startupHelper")
@Scope(ScopeType.SESSION)
@Install(precedence=Install.DEPLOYMENT)
public class FVLogin extends StartupHelper {
    private static final long serialVersionUID = 1L;

    @Override
    @Begin(id = "#{conversationIdGenerator.nextMainConversationId}", join = true)
    public String initDomainAndFindStartupPage(String domainTitle, String viewId) {

        String NUXEO_URL = restHelper.getBaseURL();

        String WEB_UI_URL = NUXEO_URL
                .replace("/nuxeo", "")
                .replace("8080", "3001");

        String backToPath = RestHelper.getHttpServletRequest().getParameter("backTo");
        String result = initServerAndFindStartupPage();

        NuxeoPrincipal currentUser = (NuxeoPrincipal) documentManager.getPrincipal();

        String redirectTo = null;

        try {

            if (currentUser.isAnonymous()) {

                // Reset JSESSIONID Cookie
                HttpServletResponse httpResponse = RestHelper.getHttpServletResponse();
                Cookie cookie = new Cookie("JSESSIONID", null);
                cookie.setMaxAge(0);
                cookie.setPath("/");
                httpResponse.addCookie(cookie);

                redirectTo = NUXEO_URL + "login.jsp?nxtimeout=true&forceAnonymousLogin=true";
            }

            else if (!currentUser.isAdministrator()) {
                // A valid "back to" path has been specified
                if (validatePath(backToPath)) {
                    redirectTo = WEB_UI_URL + backToPath;
                }
                // Otherwise, send to default dialect
                else {
                    redirectTo = WEB_UI_URL + getDefaultDialect(currentUser);
                }

            }

            if (redirectTo != null) {
                FacesContext.getCurrentInstance().getExternalContext().redirect(redirectTo);
                return null;
            }
        } catch (IOException e) {
            return dashboardNavigationHelper.navigateToDashboard();
        }

        return dashboardNavigationHelper.navigateToDashboard();
    }


    private String getDefaultDialect(NuxeoPrincipal currentUser) {
        String primary_dialect_path = null;
        String primary_dialect_short_url = null;
        String userPreferences = (String) currentUser.getModel().getPropertyValue("user:preferences");

        if (currentUser.isAnonymous()) {
            return "";
        }

        // Lookup dialect in default preferences
        if (userPreferences != null) {
            try {
                DocumentModel dialect = null;

                CustomPreferencesJSONReader prefReader = new CustomPreferencesJSONReader();
                ObjectMapper mapper = new ObjectMapper();
                JsonNode actualObj = mapper.readTree(userPreferences);

                CustomPreferencesObject userPreferencesModel = prefReader.read(actualObj);

                Object primary_dialect_obj = userPreferencesModel.getGeneralPreferences().get("primary_dialect");

                if (primary_dialect_obj != null){
                    String primary_dialect = primary_dialect_obj.toString();
                    dialect = documentManager.getDocument(new IdRef(primary_dialect));
                }

                if (dialect != null) {
                    Object primary_dialect_short_url_obj = dialect.getPropertyValue("fvdialect:short_url");

                    if (primary_dialect_short_url_obj != null) {
                        primary_dialect_short_url = primary_dialect_short_url_obj.toString();
                    }

                    primary_dialect_path = dialect.getPathAsString();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // Find first dialect user is member of...
        else {
            List<String> groups = currentUser.getGroups();

            if (groups != null) {
                Iterator it = groups.iterator();
                String inClause = "(\""+ groups.get(0) + "\"";
                it.next();
                while (it.hasNext()) {
                    inClause += ",\"" + it.next() + "\"";
                }
                inClause += ")";

                String query = "SELECT * FROM FVDialect WHERE " + NXQL.ECM_MIXINTYPE + " <> '"
                        + FacetNames.HIDDEN_IN_NAVIGATION + "' AND " + NXQL.ECM_LIFECYCLESTATE + " <> '"
                        + LifeCycleConstants.DELETED_STATE + "'" + " AND ecm:isCheckedInVersion = 0 "
                        + " AND ecm:acl/*/principal IN " + inClause + " "
                        + " AND ecm:isProxy = 0 ";

                DocumentModelList dialects = documentManager.query(query);

                if (dialects.size() > 0) {
                    primary_dialect_short_url = dialects.get(0).getPropertyValue("fvdialect:short_url").toString();
                    primary_dialect_path = dialects.get(0).getPathAsString();
                }
            }
        }

        String finalPath = "";

        if (primary_dialect_short_url != null && !primary_dialect_short_url.isEmpty()) {
            // Users who are global 'members' should just go to the Sections URL
            if (currentUser.getGroups().contains("members")) {
                finalPath = "sections/" + primary_dialect_short_url;
            }
            // Other users can go to Workspaces
            else {
                finalPath = "Workspaces/" + primary_dialect_short_url;
            }
        }
        else if (primary_dialect_path != null) {
            try {
                finalPath = "explore" + URLDecoder.decode(primary_dialect_path, StandardCharsets.UTF_8.name());
            } catch (UnsupportedEncodingException e) {
                // TODO: capture in audit log?
            }
        }

        return finalPath;
    }

    private boolean validatePath(String path) {
        String URL_REGEX =
                "^((%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)" +
                "([).!';/?:,][[:blank:]])?$";

        Pattern URL_PATTERN = Pattern.compile(URL_REGEX);

            if (path == null || path.isEmpty()) {
                return false;
            }

            Matcher matcher = URL_PATTERN.matcher(path);
            return matcher.matches();
    }
}
