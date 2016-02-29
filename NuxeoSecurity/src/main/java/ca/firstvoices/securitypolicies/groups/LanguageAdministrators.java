package ca.firstvoices.securitypolicies.groups;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
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

    /**
     * Check if user has permission on current document, to avoid using groups for filtering.
     * @param mergedAcp
     * @param additionalPrincipalsList
     * @param permission
     * @return
     */
    private Boolean hasPermissionInACP(ACP mergedAcp, List<String> additionalPrincipalsList, String permission) {

        for (ACL acl : mergedAcp.getACLs()) {
            for (ACE ace : acl.getACEs()) {
                if (ace.isGranted() && additionalPrincipalsList.contains(ace.getUsername()) &&  ace.getPermission().equals(permission) ) {
                    return true;
                }
            }
        }

    	return false;
    }

    @Override
    public boolean isRestrictingPermission(String permission) {

    	if ( permission.equals(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH) ) {
			return true;
		}

    	return false;
    }

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

        mergedAcp.getAccess(principal.getName(), CustomSecurityConstants.RECORD);

        try {
        // Restrict language administrators from publishing to someone else's FVDialect
        if ( doc.isProxy() && "FVDialect".equals(docType) && hasPermissionInACP(mergedAcp, additionalPrincipalsList, CustomSecurityConstants.CAN_ASK_FOR_PUBLISH) ) {
            if (!hasPermissionInACP(mergedAcp, additionalPrincipalsList, SecurityConstants.EVERYTHING) ) {
                return Access.DENY;
            }
        }
        } catch (Exception e){
        	System.out.print("t");
        }

        return Access.UNKNOWN;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }
}
