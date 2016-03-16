/**
 * 
 */
package ca.firstvoices.publisher.services;

import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author loopingz
 *
 */
public interface DialectPublisherService {
    /**
     * Publish a dialect, publishing its parents if needed and its direct publishable children
     * @param dialect
     */
    public void publish(DocumentModel dialect);
}
