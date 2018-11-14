package ca.firstvoices.securitypolicies.groups;

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

import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

import ca.firstvoices.utils.CustomSecurityConstants;
import ca.firstvoices.securitypolicies.utils.PermissionAndACPUtils;

import org.nuxeo.ecm.core.security.SecurityPolicy;


/**
 * Language recorders policies
 */
public class LanguageRecorders extends AbstractSecurityPolicy implements SecurityPolicy {

    /**
     * Check if user has permission on current document, to avoid using groups for filtering.
     *
     * @param permission               - current permission to be checked
     * @return true or false to question about granting accesss
     */
    @Override
    public boolean isRestrictingPermission(String permission) {

        return (permission.equals(SecurityConstants.ADD_CHILDREN) ||
                permission.equals(SecurityConstants.WRITE) ||
                permission.equals(SecurityConstants.READ) ||
                permission.equals(SecurityConstants.WRITE_PROPERTIES) ||
                permission.equals(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH) ||
                permission.equals(SecurityConstants.REMOVE_CHILDREN) ||
                permission.equals(SecurityConstants.REMOVE));
    }

    /**
     * Handles policies for recorders administrators.
     *
     * @param doc
     * @param mergedAcp
     * @param principal
     * @param permission
     * @param resolvedPermissions
     * @param additionalPrincipals
     * @return
     */
    @Override
    public Access checkPermission(Document doc, ACP mergedAcp, Principal principal, String permission,
                                  String[] resolvedPermissions, String[] additionalPrincipals) {

        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);
        List<String> resolvedPermissionsList = Arrays.asList(resolvedPermissions);

        String dState = doc.getLifeCycleState();

        if( additionalPrincipalsList.contains(CustomSecurityConstants.ADMINISTRATORS) ||
                principal.getName().equals(CustomSecurityConstants.SYSTEM_USER))  return Access.GRANT;

        if( "Published".equals(dState) ) return Access.UNKNOWN;

        if(  principal.getName().equals(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP ) ||
                additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP)) {
            return Access.UNKNOWN;
        }


        // Skip administrators, system and users who aren't recorders
        if (!additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_GROUP) ) {
            return Access.UNKNOWN;
        }

        // Observed: testing of portal visibility seems to be the best approach.
        // attempts of testing FVDialect visibility resulted in inconsitent behaviour of items either not
        // being displayed or displayed for smoe uers.
        if(  doc.getType().getName().equals("FVPortal") && permission.equals("Read") ) {
            if (!PermissionAndACPUtils.hasPermissionInACP(mergedAcp, principal, permission)) {
                return Access.DENY;
            } else {
                return Access.UNKNOWN;
            }
        }

        String docType = doc.getType().getName();

        if (PermissionAndACPUtils.hasPermissionInACP(mergedAcp, additionalPrincipalsList, CustomSecurityConstants.RECORD)) {

            // Allow adding children and removing children on allowed types
            if (PermissionAndACPUtils.isDocumentTypeAllowed(docType) && (resolvedPermissionsList.contains(SecurityConstants.ADD_CHILDREN) ||
                    resolvedPermissionsList.contains(SecurityConstants.REMOVE_CHILDREN))) {
                return Access.GRANT;
            }

            String docTypeParent = null;

            if (doc.getParent() != null) {
                docTypeParent = doc.getParent().getType().getName();

                if (PermissionAndACPUtils.isDocumentTypeAllowed(docTypeParent) &&
                        (resolvedPermissionsList.contains(SecurityConstants.WRITE_PROPERTIES) ||
                                resolvedPermissionsList.contains(SecurityConstants.REMOVE) ||
                                resolvedPermissionsList.contains(SecurityConstants.WRITE))) {
                    return Access.GRANT;
                }
            }
        }

        // Recorders can only publish to their allowed types (OK to use groups as this is globally applicable)
        if ( additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_GROUP)) {
            if( !PermissionAndACPUtils.isDocumentTypeAllowed(docType) &&
                    (resolvedPermissionsList.contains(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH))) {
                return Access.DENY;
            }
        }

        if( PermissionAndACPUtils.docTypeContains(docType)) {
            if (!PermissionAndACPUtils.hasPermissionInACP(mergedAcp, principal, permission)) {
                return Access.DENY;
            }
        }

        return Access.UNKNOWN;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return false;
    }

    @Override
    public Transformer getQueryTransformer(String repositoryName) {
        return Transformer.IDENTITY;
    }
}
