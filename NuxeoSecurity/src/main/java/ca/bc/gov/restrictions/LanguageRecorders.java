package ca.bc.gov.restrictions;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;

import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

import ca.bc.gov.utils.SecurityConstants;

/**
 * Restrict language recorders
 */
public class LanguageRecorders extends AbstractSecurityPolicy {

	private static ArrayList<String> restrictedDocumentTypes = new ArrayList<String>();	
	
    public Access checkPermission(Document doc, ACP mergedAcp,
            Principal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) throws SecurityException {
    	
        Access access = Access.UNKNOWN;

        // Skip administrators
        if (Arrays.asList(additionalPrincipals).contains("administrators")) {
            return access;
        }
        
        // Permissions the application is trying to resolve
        //List<String> resolvedPermissionsList = Arrays.asList(resolvedPermissions);

        NuxeoPrincipal np = ((NuxeoPrincipal) principal);

        // Only apply if user is part of the Recorders group
        if (np.getAllGroups().contains(SecurityConstants.RECORDERS_GROUP)){

	        if (restrictedDocumentTypes.isEmpty()) {
	        	restrictedDocumentTypes.add("FVAlphabet");
	        	restrictedDocumentTypes.add("FVPortal");
	        	restrictedDocumentTypes.add("FVLinks");
	        }

	        String docType = doc.getType().getName();
	        
	        // Disallow all actions on restricted types
            if ( restrictedDocumentTypes.contains(docType) ) {
                return Access.DENY;
            }

            // Disallow editing Dialect itself
            if ("FVDialect".equals(docType) && Arrays.asList(resolvedPermissions).contains(SecurityConstants.WRITE)) {
                //return Access.DENY;
            }
            
        	// Disallow editing on main dialect types and FVDialect
            if (( doc.getParent() != null && "FVDialect".equals(doc.getParent().getType().getName()) ) && Arrays.asList(resolvedPermissions).contains(SecurityConstants.WRITE)) {
                //return Access.DENY;
            }
            
            // Allow creating children in FVDictionary
            if ("FVDictionary".equals(docType) && Arrays.asList(resolvedPermissions).contains(SecurityConstants.ADD_CHILDREN)) {
                return Access.GRANT;
            }
        }
        
        return access;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }
}
