/**
 * 
 */
package ca.firstvoices.publisher.services;

import org.nuxeo.ecm.core.api.DocumentModel;

/**
 * @author loopingz
 *
 */
public interface FirstVoicesPublisherService {
    /**
     * Publish a dialect, publishing its parents if needed and its direct publishable children
     * @param dialect
     */
    public DocumentModel publishDialect(DocumentModel dialect);
    
    /**
     * Unpublish a dialect, cleaning its parent if they have no more child
     * @param dialect
     */
    public void unpublishDialect(DocumentModel dialect);
    
    /**
     * Publish an asset, publishing its related assets and adding proxies information
     * @param asset
     */
    public DocumentModel publishAsset(DocumentModel asset);
    
    /**
     * Unpublish an asset, it wont clean the related assets
     * @param asset
     */
    public void unpublishAsset(DocumentModel asset);
    
    /**
     * Will split depending on the document between unpublishAsset and unpublishDialect
     * @param doc to unpublish
     */
    public void unpublish(DocumentModel doc);

    /**
     * Will split depending on the document between publishAsset and publishDialect
     * @param doc to publish
     */
    public DocumentModel publish(DocumentModel doc);
}
