/**
 * 
 */
package ca.firstvoices.nativeorder.services;

import java.util.Arrays;
import java.util.Comparator;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import ca.firstvoices.services.AbstractService;

/**
 * @author loopingz
 *
 */
public class NativeOrderComputeServiceImpl extends AbstractService implements NativeOrderComputeService {

    private DocumentModel[] loadAlphabet(CoreSession session, DocumentModel dialect) {
        // TODO Know how the Alphabet is ordered
        DocumentModelList chars = session.query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='"+dialect.getId()+"'");
        DocumentModel[] models = new DocumentModel[chars.size()];
        models = chars.toArray(models);
        Arrays.sort(models, new Comparator<DocumentModel>() {

            @Override
            public int compare(DocumentModel o1, DocumentModel o2) {
                String title1 = (String) o1.getPropertyValue("dc:title");
                String title2 = (String) o2.getPropertyValue("dc:title");
                if (title1 == title2 && title1 == null) {
                    return 0;
                }
                if (title2 == null) {
                    return -1;                    
                }
                if (title1 == null) {
                    return 1;
                }
                if (title1.length() < title2.length()) {
                    return 1;
                } else if (title1.length() > title2.length()) {
                    return -1;
                } else {
                    return 0;
                }
            }
            
        });
        return models;
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeAssetNativeOrderTranslation(org.nuxeo.ecm.core.api.DocumentModel)
     */
    @Override
    public void computeAssetNativeOrderTranslation(DocumentModel asset) {
        DocumentModel dialect = getDialect(asset);
        CoreSession session = asset.getCoreSession();
        // First get the native alphabet
        DocumentModel[] chars = loadAlphabet(session, dialect);
        computeNativeOrderTranslation(chars, asset);
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeDialectNativeOrderTranslation(org.nuxeo.ecm.core.api.DocumentModel)
     */
    @Override
    public void computeDialectNativeOrderTranslation(DocumentModel dialect) {
        CoreSession session = dialect.getCoreSession();
        // First get the native alphabet
        DocumentModel[] chars = loadAlphabet(session, dialect);
        computeNativeOrderTranslation(chars, session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='"+dialect.getId()+"'"));
        computeNativeOrderTranslation(chars, session.query("SELECT * FROM FVPhrase WHERE ecm:ancestorId='"+dialect.getId()+"'"));
        session.save();
    }
    
    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModel element) {
        String title = (String) element.getPropertyValue("dc:title");
        String nativeTitle = "";
        while (title.length() > 0) {
            boolean found = false;
            for (DocumentModel charDoc : chars) {
                String charValue = (String) charDoc.getPropertyValue("dc:title");
                if (title.startsWith(charValue)) {
                    nativeTitle += new Character((char) (33 + (Long) charDoc.getPropertyValue("fvcharacter:alphabet_order"))).toString();
                    title = title.substring(charValue.length());
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (" ".equals(title.substring(0, 1))) {
                    nativeTitle += new Character((char) (33 + chars.length + 1)).toString();
                } else {
                    nativeTitle += title.substring(0,1);
                }
                title = title.substring(1);
            }
        }
        element.setPropertyValue("fv:custom_order", nativeTitle);
        element.getCoreSession().saveDocument(element);
    }

    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModelList elements) {
        for (DocumentModel doc : elements) {
            computeNativeOrderTranslation(chars, doc);
        }
    }
}
