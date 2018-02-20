/**
 *
 */
package ca.firstvoices.nativeorder.services;

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
        DocumentModelList chars = session.query("SELECT * FROM FVCharacter WHERE ecm:ancestorId='"+dialect.getId()+"' ORDER BY fvcharacter:alphabet_order");
        DocumentModel[] models = new DocumentModel[chars.size()];

        models = chars.toArray(models);

        DocumentModel[] sortedModels = new DocumentModel[chars.size()];
        int i, j;
        for( i = 0; i < models.length; i++ ) {
        	DocumentModel item = models[ i ];
        	DocumentModel toAdd = item;
        	String title = (String) item.getPropertyValue( "dc:title" );
        	Long order = (Long)item.getPropertyValue( "fvcharacter:alphabet_order" );
        	for( j = i + 1; j < models.length; j++ ) {
        		DocumentModel item2 = models[ j ];
        		String title2 = (String) item2.getPropertyValue( "dc:title" );
        		Long order2 = (Long) item2.getPropertyValue( "fvcharacter:alphabet_order" );

        		if( order != null || order2 != null ) {
        			// use the orders to sort by
        			if( order == null ) {
        				// use item2
        				toAdd = item2;
        			} else if( order != null && order2 != null ) {
        				if( order2 < order ) {
        					// use item2
        					toAdd = item2;
        				}
        			}
        		} else if( title == null || ( title.length() < title2.length() ) ) {
        			toAdd = item2;
        		}

        		title = (String) toAdd.getPropertyValue( "dc:title" );
        		order = (Long) toAdd.getPropertyValue( "fvcharacter:alphabet_order" );
        	}

        	sortedModels[ i ] = toAdd;
        }

        return sortedModels;
//        try {
//        Arrays.sort(models, new Comparator<DocumentModel>() {
//
//            @Override
//            public int compare(DocumentModel o1, DocumentModel o2) {
//                String title1 = (String) o1.getPropertyValue("dc:title");
//                String title2 = (String) o2.getPropertyValue("dc:title");
//                if (title1 == title2 && title1 == null) {
//                    return 0;
//                }
//                if (title2 == null) {
//                    return -1;
//                }
//                if (title1 == null) {
//                    return 1;
//                }
//                if (title1.length() < title2.length()) {
//                    return 1;
//                } else if (title1.length() > title2.length()) {
//                    return -1;
//                } else {
//                    return 0;
//                }
//            }
//
//        });
//        } catch( Exception e ) {
//        	e.printStackTrace();
//        }
//        return models;
    }

    /* (non-Javadoc)
     * @see ca.firstvoices.publisher.services.NativeOrderComputeService#computeAssetNativeOrderTranslation(org.nuxeo.ecm.core.api.DocumentModel)
     */
    @Override
    public void computeAssetNativeOrderTranslation(DocumentModel asset) {
    	// appears that there's a lot of processing going on within the following methods
    	// last of which, computeNativeOrderTranslation will just return if the asset is immutable
    	// so, instead of processing all the dialect data, and the alphabet only to do nothing,
    	// lets check that here
    	if( !asset.isImmutable() ) {
    		DocumentModel dialect = getDialect(asset);
    		CoreSession session = asset.getCoreSession();
    		// First get the native alphabet
    		DocumentModel[] chars = loadAlphabet(session, dialect);
    		computeNativeOrderTranslation(chars, asset);
    	}
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
    	if( element.isImmutable() ) {
    		// We cannot update this element, no point in going any further
    		return;
    	}
        String title = (String) element.getPropertyValue("dc:title");
        String nativeTitle = "";
        while (title.length() > 0) {
            boolean found = false;
            for (DocumentModel charDoc : chars) {
                String charValue = (String) charDoc.getPropertyValue("dc:title");
                String ucCharValue = (String) charDoc.getPropertyValue("fvcharacter:upper_case_character");
                if ((charValue != null && title.startsWith(charValue)) || (ucCharValue != null && title.startsWith(ucCharValue))) {
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

        if( !element.isImmutable() ) {
        	element.setPropertyValue("fv:custom_order", nativeTitle);
        }
        element.getCoreSession().saveDocument(element);
    }

    protected void computeNativeOrderTranslation(DocumentModel[] chars, DocumentModelList elements) {
        for (DocumentModel doc : elements) {
            computeNativeOrderTranslation(chars, doc);
        }
    }
}
