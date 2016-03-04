package ca.firstvoices.securitypolicies.groups;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

/**
 * Restrict non administrators from deleting essential data types.
 */
public class NonAdministrators  extends AbstractSecurityPolicy {

	private static ArrayList<String> restrictedDocumentTypes = new ArrayList<String>();

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp,
            Principal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {

        // Skip administrators
        if (Arrays.asList(additionalPrincipals).contains("administrators") || !Arrays.asList(additionalPrincipals).contains("language_administrators")) {
            return Access.UNKNOWN;
        }

        // Skip permissions that are READ, this policy will not limit them
        if ("BROWSE".equals(permission)) {
        	return Access.UNKNOWN;
        }

        String docType = doc.getType().getName();

        // Disallow all actions besides 'READ' on main areas
        if (!Arrays.asList(resolvedPermissions).contains(SecurityConstants.READ) && ("WorkspaceRoot".equals(docType) || "SectionRoot".equals(docType) || "Domain".equals(docType))) {
            return Access.DENY;
        }

        // Only apply to remove, and if not published document.
        if (!doc.isProxy() && Arrays.asList(resolvedPermissions).contains(SecurityConstants.REMOVE)) {

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

            	// Restrict deletion of FVDialect children (but not unpublishing)
                if ("FVDialect".equals(parentType)) {
                    return Access.DENY;
                }

                // Restrict deletion of 'Data' and 'SharedData' folders
                else if ( ("WorkspaceRoot".equals(parentType) || "SectionRoot".equals(parentType)) &&
                	 ("Data".equals(doc.getName()) || "SharedData".equals(doc.getName()))) {
                    return Access.DENY;
                }

                // Restrict deletion of children of 'SharedData' (but not unpublishing)
                else if ("SharedData".equals(doc.getParent().getName()) && ("Workspace".equals(parentType) || "Section".equals(parentType))) {
                    return Access.DENY;
                }
            }
        }

        return Access.UNKNOWN;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return true;
    }

    @Override
    public Transformer getQueryTransformer(String repositoryName) {
        return Transformer.IDENTITY;
    }
}
