package ca.bc.gov.restrictions;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

import ca.bc.gov.utils.SecurityConstants;

/**
 * Restrict non administrators from deleting essential data types.
 */
public class NonAdministrators  extends AbstractSecurityPolicy {

	private static ArrayList<String> restrictedDocumentTypes = new ArrayList<String>();

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp,
            Principal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {

        Access access = Access.UNKNOWN;

        // Skip administrators
        if (Arrays.asList(additionalPrincipals).contains("administrators")) {
            return access;
        }

        String docType = doc.getType().getName();

        // Disallow all actions besides 'READ' on main area
        if (!Arrays.asList(resolvedPermissions).contains(org.nuxeo.ecm.core.api.security.SecurityConstants.READ) && ("WorkspaceRoot".equals(docType) || "SectionRoot".equals(docType) || "Domain".equals(docType))) {
            return Access.DENY;
        }

        if (Arrays.asList(resolvedPermissions).contains("ReadRemove") && Arrays.asList(resolvedPermissions).contains(org.nuxeo.ecm.core.api.security.SecurityConstants.REMOVE)) {

            if (restrictedDocumentTypes.isEmpty()) {
            	restrictedDocumentTypes.add("FVLanguageFamily");
            	restrictedDocumentTypes.add("FVLanguage");
            	restrictedDocumentTypes.add("FVDialect");
            }

            if (restrictedDocumentTypes.contains(docType)) {
                return Access.DENY;
            }

            if (doc.getParent() != null) {

            	String parentType = doc.getParent().getType().getName();

            	// Restrict deletion of FVDialect children
                if ("FVDialect".equals(parentType)) {
                    return Access.DENY;
                }

                // Restrict deletion of 'Data' and 'SharedData' folders
                else if ( ("WorkspaceRoot".equals(parentType) || "SectionRoot".equals(parentType)) &&
                	 ("Data".equals(doc.getName()) || "SharedData".equals(doc.getName()))) {
                    return Access.DENY;
                }

                // Restrict deletion of children of 'SharedData'
                else if ("SharedData".equals(doc.getParent().getName()) && ("Workspace".equals(parentType) || "Section".equals(parentType))) {
                    return Access.DENY;
                }
            }
        }

        return access;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }
}
