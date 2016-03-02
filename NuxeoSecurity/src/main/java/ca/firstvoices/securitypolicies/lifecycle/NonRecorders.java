package ca.firstvoices.securitypolicies.lifecycle;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;

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

public class NonRecorders extends AbstractSecurityPolicy {

    @Override
    public Access checkPermission(Document doc, ACP mergedAcp, Principal principal, String permission,
            String[] resolvedPermissions, String[] additionalPrincipals) {
        
        List<String> additionalPrincipalsList = Arrays.asList(additionalPrincipals);
        // Users who aren't at least recorders should be denied access documents with New or Disabled state
        if (!additionalPrincipalsList.contains("recorders")) { 
        	String docLifeCycle = doc.getLifeCycleState();
            if (docLifeCycle != null) {
            	if(docLifeCycle.equals("New") || docLifeCycle.equals("Disabled")) {
            		return Access.DENY;
            	}	
            }
        }      
        return Access.UNKNOWN;
    }

    @Override
    public SQLQuery.Transformer getQueryTransformer() {
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
 
        public static final Predicate NOT_DISABLED = new Predicate(new Reference(NXQL.ECM_LIFECYCLESTATE), Operator.NOTEQ, new StringLiteral("Disabled"));
        public static final Predicate NOT_NEW = new Predicate(new Reference(NXQL.ECM_LIFECYCLESTATE), Operator.NOTEQ, new StringLiteral("New"));        
        
        @Override
        public SQLQuery transform(Principal principal, SQLQuery query) {
        	
        	NuxeoPrincipal nxPrincipal = (NuxeoPrincipal) principal;
        	
        	// Modify the query for anonymous and non-recorders only
        	if(nxPrincipal.isAnonymous() || !nxPrincipal.isMemberOf("recorders")) {
                WhereClause where = query.where;
                Predicate predicate;
                if (where == null || where.predicate == null) {
                	predicate = new Predicate(NOT_DISABLED, Operator.AND, NOT_NEW);
                } else {
                	Predicate notDisabledAndNotNew = new Predicate(NOT_DISABLED, Operator.AND, NOT_NEW);
                	predicate = new Predicate(notDisabledAndNotNew, Operator.AND, where.predicate);
                }
                // return query with updated WHERE clause
                return new SQLQuery(query.select, query.from, new WhereClause(predicate),
                        query.groupBy, query.having, query.orderBy, query.limit, query.offset);
        	}
        	
            return query;
        }
    }    

}
