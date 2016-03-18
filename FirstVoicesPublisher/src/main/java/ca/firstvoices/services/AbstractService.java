package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;

public abstract class AbstractService {

    protected DocumentModel getDialect(DocumentModel doc) {
        DocumentModel parent = doc;
        while (parent != null && !"FVDialect".equals(parent.getType())) {
            parent = doc.getCoreSession().getDocument(parent.getParentRef());
        }
        return parent;
    }
}
