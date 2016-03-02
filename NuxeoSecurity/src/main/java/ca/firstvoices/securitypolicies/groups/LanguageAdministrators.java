package ca.firstvoices.securitypolicies.groups;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

import ca.firstvoices.utils.CustomSecurityConstants;

/**
 * Language administrators policies
 */
public class LanguageAdministrators extends AbstractSecurityPolicy {

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp,
            Principal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {

        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

        // Skip administrators, system user and groups that aren't language administrators
        if (additionalPrincipalsList.contains("administrators") || principal.equals(SecurityConstants.SYSTEM_USERNAME) || !additionalPrincipalsList.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
            return Access.UNKNOWN;
        }

        // Skip permissions that are READ, this policy will not limit them
        if ("BROWSE".equals(permission)) {
        	return Access.UNKNOWN;
        }

        String docType = doc.getType().getName();

        // Restrict language administrators from publishing to someone else's FVDialect
        if ( doc.isProxy() && "FVDialect".equals(docType) ) {

        	// Check if language administrator can do everything on the section. If not, deny.
            if ( !Access.GRANT.equals(mergedAcp.getAccess(additionalPrincipals, new String[]{SecurityConstants.EVERYTHING})) ) {
                return Access.DENY;
            }
        }

        return Access.UNKNOWN;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }
}
