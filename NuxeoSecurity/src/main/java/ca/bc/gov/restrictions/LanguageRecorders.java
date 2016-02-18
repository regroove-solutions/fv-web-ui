package ca.bc.gov.restrictions;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;
import ca.bc.gov.utils.CustomSecurityConstants;

/**
 * Language recorders policies
 */
public class LanguageRecorders extends AbstractSecurityPolicy {

    // A list of document types with ReadWrite Permissions
    private static ArrayList<String> allowedDocumentTypes = new ArrayList<String>();

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

        // Permissions apply to recorders only
        if ( hasPermissionInACP(mergedAcp, additionalPrincipalsList, CustomSecurityConstants.RECORD) ) {

            if (allowedDocumentTypes.isEmpty()) {
                allowedDocumentTypes.add("FVCategories");
                allowedDocumentTypes.add("FVContributors");
                allowedDocumentTypes.add("FVDictionary");
                allowedDocumentTypes.add("FVResources");
            }

            // Allow adding children and removing children on allowed types
            if (allowedDocumentTypes.contains(docType) && (resolvedPermissionsList.contains(SecurityConstants.ADD_CHILDREN) || resolvedPermissionsList.contains(SecurityConstants.REMOVE_CHILDREN)) ) {
                return Access.GRANT;
            }

            // Allow Publishing, Writing and Removing on allowed document type children
            if (docTypeParent != null && allowedDocumentTypes.contains(docTypeParent) && (resolvedPermissionsList.contains(SecurityConstants.WRITE_PROPERTIES) || resolvedPermissionsList.contains(SecurityConstants.REMOVE) || resolvedPermissionsList.contains(SecurityConstants.WRITE)) ) {
                return Access.GRANT;
            }
        }

        // Recorders can never publish within FVDialect, so OK to use groups
        if (additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_GROUP)) {            
            if ("FVDialect".equals(docType) && (resolvedPermissionsList.contains(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH)) ) {
                return Access.DENY;
            }
        }

        return access;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }
}
