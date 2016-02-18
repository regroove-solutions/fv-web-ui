package ca.bc.gov.restrictions;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.nuxeo.ecm.core.api.model.PropertyNotFoundException;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;
import ca.bc.gov.utils.CustomSecurityConstants;

/**
 * Privacy security policy
 */
public class PrivacyRestrictions extends AbstractSecurityPolicy {

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp,
            Principal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {

        Access access = Access.UNKNOWN;
        List<String> resolvedPermissionsList = Arrays.asList(resolvedPermissions);
        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

        String docType = doc.getType().getName();
        String docTypeParent = null;
        
        if (doc.getParent() != null) {
        	docTypeParent = doc.getParent().getType().getName();
        }

        // Skip administrators
        if (additionalPrincipalsList.contains("administrators")) {
            return access;
        }
        
        // Only apply to READ
        if (!resolvedPermissionsList.contains(SecurityConstants.READ)) {
        	return access;
        }

        try {
            if ((boolean) doc.getPropertyValue("fvp:isPrivate")){
            	return Access.DENY;
            }

        } catch (PropertyNotFoundException e) {
            return access;
        }

        return access;
    }

    @Override
    // TODO: Fill this!
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }
}
