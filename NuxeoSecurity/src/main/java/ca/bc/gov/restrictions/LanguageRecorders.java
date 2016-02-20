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
import org.nuxeo.ecm.core.query.sql.model.*;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.query.sql.NXQL;
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
    public boolean isRestrictingPermission(String permission) {
        return true;
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

        // Recorders can only publish to their allowed types (OK to use groups as this is globally applicable)
        if (additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_GROUP) || additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_APPROVERS_GROUP)) {
            if (!allowedDocumentTypes.contains(docType) && (resolvedPermissionsList.contains(CustomSecurityConstants.CAN_ASK_FOR_PUBLISH)) ) {
                return Access.DENY;
            }
        }

        return access;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName, String queryLanguage) {
        return false;
    }


    @Override
    public SQLQuery.Transformer getQueryTransformer() {
        return NO_FILE_TRANSFORMER;
    }

    public static final Transformer NO_FILE_TRANSFORMER = new NoFileTransformer();

    /**
     * Sample Transformer that adds {@code AND ecm:primaryType <> 'File'} to the query.
     */
    public static class NoFileTransformer implements SQLQuery.Transformer {

        /**
         *
         */
        private static final long serialVersionUID = 1L;
        /** {@code ecm:primaryType <> 'File'} */
        public static final Predicate NO_FILE = new Predicate(
                new Reference(NXQL.ECM_PRIMARYTYPE), Operator.NOTEQ, new StringLiteral("File"));

        @Override
        public SQLQuery transform(Principal principal, SQLQuery query) {
            WhereClause where = query.where;
            Predicate predicate;
            if (where == null || where.predicate == null) {
                predicate = NO_FILE;
            } else {
                // adds an AND ecm:primaryType <> 'File' to the WHERE clause
                predicate = new Predicate(NO_FILE, Operator.AND, where.predicate);
            }
            // return query with updated WHERE clause
            return new SQLQuery(query.select, query.from, new WhereClause(predicate),
                    query.groupBy, query.having, query.orderBy, query.limit, query.offset);
        }
    }
}
