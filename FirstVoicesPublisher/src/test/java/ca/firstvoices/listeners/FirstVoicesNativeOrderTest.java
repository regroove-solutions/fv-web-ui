/**
 * 
 */

package ca.firstvoices.listeners;

import static org.junit.Assert.*;

import java.security.InvalidParameterException;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.LocalDeploy;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.RuntimeFeature;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.publisher.services.FirstVoicesPublisherServiceImpl;

import javax.inject.Inject;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, PlatformFeature.class})
@Deploy({"studio.extensions.First-Voices", "org.nuxeo.ecm.platform.forum.core:OSGI-INF/forum-schemas-contrib.xml"})
@LocalDeploy({"FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml"
})
public class FirstVoicesNativeOrderTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected NativeOrderComputeService nativeOrderComputeService;

    private DocumentModel dialectDoc;

    private DocumentModel word;
    
    private String[] orderedWords = {"ʔaʔapp̕iqa", "ʔaḥʔaaʔaaƛ", "ʕaʕac̕ikn̕uk", "ʔaaʔaƛkʷin", "ʕaanus", "ʔeʔiič’im", "cakaašt", "caqiic ʔiš suč’ačiłał", "cawaak", "caapin", "ciciḥʔaƛmapt", "cuwit", "cuxʷaašt", "c̓iixaat̓akƛinƛ", "čuup", "č’iʔii", "hachaapsim", "hayuxsyuučiƛ", "hayu ʔiš muučiiłał", "k̕uʔihta", "ƛułčakup", "ƛ̕uu-čiƛ", "ma", "mułaa", "m̓am̓iiqsu", "naʔaataḥ", "naw̕ahi", "nunuukma", "piišpiš", "qacc̕a", "qiicqiica", "qiišʔaqƛi", "sasin", "saasin","suč’a","šuuwis", "t̓iqʷas", "uksuukł", "ʔukłaa", "ʕuupqšiƛ", "weʔičʔin", "wiwiiquk", "xʷakak", "yaciicʔił", "yeeł", "y̕eʔisi"};

    private String[] alphabet = {"a","ʔa","ʕa","aa","ʔaa","ʕaa","e","ʔe","ʕe","ee","ʔee","ʕee","c","c̕","č","č’","h","ḥ","i","ʔi","ʕi","ii","ʔii","ʕii","k","k̕","kʷ","k̕ʷ","ł","ƛ","ƛ̕","m","m̕","n","n̕","p","p̕","q","qʷ","s","š","t","t̕","u","ʔu","ʕu","uu","ʔuu","ʕuu","w","w̕","x","x̣","xʷ","x̣ʷ","y","y̕","ʕ","ʔ"};
    
    private String alphaArr;

    @Before
    public void setUp() throws Exception {
        DocumentModel domain = createDocument(session.createDocumentModel("/", "FV", "Domain"));
        createDialectTree();
        createAlphabet();
        createWords();
    }

    protected void createDialectTree() throws Exception {
        createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        dialectDoc = createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
    }

    private DocumentModel createDocument(DocumentModel model) {
        model.setPropertyValue("dc:title", model.getName());
        return session.createDocument(model);
    }
    private void createAlphabet() {
        Integer i = 0;
        for (String letter : alphabet) {
            DocumentModel letterDoc = session.createDocumentModel("/Family/Language/Dialect/Alphabet", letter, "FVCharacter");
            letterDoc.setPropertyValue("fvcharacter:alphabet_order", i);
            createDocument(letterDoc);
            i++;
        }
    }
    private void createWords() {
        Integer i = 0;
        for (String wordValue : orderedWords) {
            word = session.createDocumentModel("/Family/Language/Dialect/Dictionary", wordValue, "FVWord");
            word.setPropertyValue("fv:reference", String.valueOf(i));
            word = createDocument(word);
            i++;
        }
    }

    private DocumentModel getProxy(DocumentModel model) {
        return session.getProxies(model.getRef(), null).get(0);
    }

    @Test
    public void testDialectOrdering() throws Exception {
       nativeOrderComputeService.computeDialectNativeOrderTranslation(dialectDoc);
       Integer i = orderedWords.length-1;
       for (DocumentModel doc : session.query("SELECT * FROM FVWord WHERE ecm:ancestorId='"+dialectDoc.getId()+"' ORDER BY fv:custom_order DESC")) {
           assertEquals(i, Integer.valueOf((String) doc.getPropertyValue("fv:reference")));
           i--;
       }
    }
}