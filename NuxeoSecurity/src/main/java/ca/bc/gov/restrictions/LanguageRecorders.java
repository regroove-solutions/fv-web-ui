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
import org.nuxeo.ecm.core.schema.FacetNames;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;
import ca.bc.gov.utils.CustomSecurityConstants;

/**
 * Language recorders policies
 */
public class LanguageRecorders extends AbstractSecurityPolicy {

    // A list of absolutely restricted document types
	private static ArrayList<String> restrictedDocumentTypes = new ArrayList<String>();

    // A list of document types with ReadWrite Permissions
    private static ArrayList<String> allowedDocumentTypes = new ArrayList<String>();

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

        Boolean isRecorder = false;
        Boolean isPublisher = false;

        for (ACL acl : mergedAcp.getACLs()) {
            for (ACE ace : acl.getACEs()) {

                // Check if user has a RECORDER permission on current document
                if (ace.isGranted() && additionalPrincipalsList.contains(ace.getUsername()) &&  ace.getPermission().equals(CustomSecurityConstants.RECORD) ) {
                    isRecorder = true;
                }

                // Check if user has publishing permissions on current document (publish space)
                if (doc.hasFacet(FacetNames.PUBLISH_SPACE)) {
                    if (ace.isGranted() && additionalPrincipalsList.contains(ace.getUsername()) &&  ace.getPermission().equals(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH) ) {
                        isPublisher = true;
                    }
                }
            }
        }

        // Restrictions apply to recorders
        if ( isRecorder ) {

            // Setup restricted document types
            if (restrictedDocumentTypes.isEmpty()) {
                restrictedDocumentTypes.add("FVAlphabet");
                restrictedDocumentTypes.add("FVPortal");
                restrictedDocumentTypes.add("FVLinks");
            }

            if (allowedDocumentTypes.isEmpty()) {
                allowedDocumentTypes.add("FVCategories");
                allowedDocumentTypes.add("FVContributors");
                allowedDocumentTypes.add("FVDictionary");
                allowedDocumentTypes.add("FVResources");
            }

            // Disallow all actions on restricted types
            if ( restrictedDocumentTypes.contains(docType) ) {
                return Access.DENY;
            }

            // Allow adding children and removing children on allowed types
            if (allowedDocumentTypes.contains(docType) && (resolvedPermissionsList.contains(SecurityConstants.ADD_CHILDREN) || resolvedPermissionsList.contains(SecurityConstants.REMOVE_CHILDREN)) ) {
                return Access.GRANT;
            }

            // Allow Publishing, Writing and Removing on allowed document type children
            if (docTypeParent != null && allowedDocumentTypes.contains(docTypeParent) && (resolvedPermissionsList.contains(SecurityConstants.WRITE_PROPERTIES) || resolvedPermissionsList.contains(SecurityConstants.REMOVE)) ) {
                return Access.GRANT;
            }
        }

        if (isPublisher) {
            // Deny publishing on dialect from recorders (only children should be allowed)
            if ("FVDialect".equals(docType) && doc.hasFacet(FacetNames.PUBLISH_SPACE) && (resolvedPermissionsList.contains(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH)) ) {
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
