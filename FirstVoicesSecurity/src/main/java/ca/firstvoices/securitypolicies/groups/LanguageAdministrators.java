package ca.firstvoices.securitypolicies.groups;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;

import ca.firstvoices.utils.CustomSecurityConstants;
import ca.firstvoices.securitypolicies.utils.PermissionAndACPUtils;

/**
 * Language administrators policies
 */
public class LanguageAdministrators extends AbstractSecurityPolicy {

    /**
     * Handles policies for Language administrators.
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

        String dState = doc.getLifeCycleState();

        if( additionalPrincipalsList.contains(CustomSecurityConstants.ADMINISTRATORS) ||
                principal.getName().equals(CustomSecurityConstants.SYSTEM_USER)) return Access.GRANT;

        if( "Published".equals(dState) ) return Access.UNKNOWN;

        if( principal.getName().equals(CustomSecurityConstants.RECORDERS_GROUP ) ||
                principal.getName().equals(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP )) return Access.UNKNOWN;

        String type = doc.getType().getName();

        if( type.equals("FVPortal") && permission.equals("Read") ) {
            if (!PermissionAndACPUtils.hasPermissionInACP(mergedAcp, principal, permission)) {
                return Access.DENY;
            } else return Access.UNKNOWN;
        }

        if( PermissionAndACPUtils.docTypeContains(type)) {
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
    public boolean isRestrictingPermission(String permission) {
        return true;
    }

    @Override
    public Transformer getQueryTransformer(String repositoryName) {
        return Transformer.IDENTITY;
    }
}
