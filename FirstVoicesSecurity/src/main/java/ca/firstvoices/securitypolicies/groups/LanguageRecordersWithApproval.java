package ca.firstvoices.securitypolicies.groups;

import ca.firstvoices.securitypolicies.utils.PermissionAndACPUtils;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import ca.firstvoices.utils.CustomSecurityConstants;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;
import org.nuxeo.ecm.core.security.SecurityPolicy;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

public class LanguageRecordersWithApproval extends AbstractSecurityPolicy implements SecurityPolicy {

    /**
     * Handles policies for recorders with approval administrators.
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
        String docType = doc.getType().getName();

        if( additionalPrincipalsList.contains(CustomSecurityConstants.ADMINISTRATORS) ||
                principal.getName().equals(CustomSecurityConstants.SYSTEM_USER)) return Access.GRANT;

        if( "Published".equals(dState) ) return Access.UNKNOWN;

        // Skip administrators, system and users who are NOT recorders with approval
        if( principal.getName().equals(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP) ||
                !additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP)) {
            return Access.UNKNOWN;
        }

        if (docType.equals("FVPortal") && permission.equals("Read")) {
            if (!PermissionAndACPUtils.hasPermissionInACP(mergedAcp, principal, permission)) {
                return Access.DENY;
            } else return Access.UNKNOWN;
        }

        if (additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP)) {
            if( !PermissionAndACPUtils.isDocumentTypeAllowed(docType) &&
                    (resolvedPermissionsList.contains(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH))) return Access.DENY;
        }
        if( PermissionAndACPUtils.docTypeContains(docType)) {
            if (!PermissionAndACPUtils.hasPermissionInACP(mergedAcp, principal, permission)) {
                return Access.DENY;
            }
        }

        return Access.UNKNOWN;
    }

    @Override
    public boolean isRestrictingPermission(String permission) {
        return false;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return true;
    }

    @Override
    public SQLQuery.Transformer getQueryTransformer(String repositoryName) {
        return Transformer.IDENTITY;
    }
}
