package ca.firstvoices.securitypolicies.lifecycle;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
//import java.util.Collection;

import org.nuxeo.ecm.core.lifecycle.LifeCycleService;
import org.nuxeo.ecm.core.lifecycle.LifeCycle;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.Access;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.query.sql.model.Operator;
import org.nuxeo.ecm.core.query.sql.model.Predicate;
import org.nuxeo.ecm.core.query.sql.model.Reference;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery;
import org.nuxeo.ecm.core.query.sql.model.SQLQuery.Transformer;
import org.nuxeo.ecm.core.query.sql.model.StringLiteral;
import org.nuxeo.ecm.core.query.sql.model.WhereClause;
import org.nuxeo.ecm.core.security.AbstractSecurityPolicy;
import ca.firstvoices.securitypolicies.utils.PermissionAndACPUtils;
import ca.firstvoices.utils.CustomSecurityConstants;

public class NonRecorders extends AbstractSecurityPolicy {

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp, Principal principal, String permission,
                                  String[] resolvedPermissions, String[] additionalPrincipals) {

        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);

        // Skip administrators
        if (additionalPrincipalsList.contains(CustomSecurityConstants.ADMINISTRATORS) ||
                additionalPrincipalsList.contains(CustomSecurityConstants.RECORDERS_GROUP) ||
                additionalPrincipalsList.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {

            return Access.UNKNOWN;
        }

        // Users who aren't at least recorders should be denied access documents with New or Disabled state
        String docLifeCycleState = doc.getLifeCycleState();

        if (docLifeCycleState != null) {
            String type = doc.getType().getName();

            if (docLifeCycleState.equals("Published")) return Access.UNKNOWN;;

            if( ((NuxeoPrincipal)principal).isAnonymous()) {

                if ( !type.contains("Portal")) {
                    if( PermissionAndACPUtils.docTypeContains( type )) {
                        return Access.DENY;
                    }
                    else
                        return Access.UNKNOWN;
                }
            } else if (docLifeCycleState.equals("New") || docLifeCycleState.equals("Disabled")) {
                return Access.DENY;
            }
            else
                return Access.UNKNOWN;
        }

        return Access.UNKNOWN;
    }

    @Override
    public SQLQuery.Transformer getQueryTransformer(String repositoryName) {
        return NOT_DISABLED_AND_NOT_NEW_TRANSFORMER;
    }

    @Override
    public boolean isExpressibleInQuery(String repositoryName) {
        return true;
    }

    public static final Transformer NOT_DISABLED_AND_NOT_NEW_TRANSFORMER = new NotDisabledAndNotNewTransformer();
    /**
     * Transformer that adds {@code AND ecm:lifeCycleState <> 'Disabled' AND ecm:lifeCycleState <> 'New'} to the query.
     */
    public static class NotDisabledAndNotNewTransformer implements SQLQuery.Transformer {

        private static final long serialVersionUID = 1L;
        public static final Predicate NOT_DISABLED = new Predicate(new Reference(NXQL.ECM_LIFECYCLESTATE), Operator.NOTEQ, new StringLiteral("Disabled"));
        public static final Predicate NOT_NEW = new Predicate(new Reference(NXQL.ECM_LIFECYCLESTATE), Operator.NOTEQ, new StringLiteral("New"));
        public static final Predicate NOT_ENABLED = new Predicate(new Reference(NXQL.ECM_LIFECYCLESTATE), Operator.NOTEQ, new StringLiteral("Enabled"));

        /**
         * @param principal
         * @param query
         * @return
         */
        @Override
        public SQLQuery transform(Principal principal, SQLQuery query) {

            NuxeoPrincipal nxPrincipal = (NuxeoPrincipal) principal;

            // Skip Admins
            if (nxPrincipal.isAdministrator()) {
                return query;
            }

            // Modify the query for anonymous and non-recorders only
            if(nxPrincipal.isAnonymous() || (!nxPrincipal.isMemberOf(CustomSecurityConstants.RECORDERS_GROUP) && !nxPrincipal.isMemberOf(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) ) {

                WhereClause where = query.where;
                Predicate predicate;

                if (where == null || where.predicate == null) {
                    predicate = new Predicate(NOT_DISABLED, Operator.AND, NOT_NEW);
                } else {
                    Predicate notDisabledAndNotNew = new Predicate(NOT_DISABLED, Operator.AND, NOT_NEW);
                    Predicate notEnabled = new Predicate( notDisabledAndNotNew, Operator.AND, NOT_ENABLED);
                    predicate = new Predicate(notEnabled, Operator.AND, where.predicate);
                }
                // return query with updated WHERE clause
                return new SQLQuery(query.select, query.from, new WhereClause(predicate),
                        query.groupBy, query.having, query.orderBy, query.limit, query.offset);
            }

            return query;
        }
    }
}
